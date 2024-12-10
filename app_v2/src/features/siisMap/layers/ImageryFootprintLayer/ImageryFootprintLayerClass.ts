import Color from '@arcgis/core/Color';
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import Collection from '@arcgis/core/core/Collection.js';
import { debounce } from '@arcgis/core/core/promiseUtils.js';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import { SpatialReference } from '@arcgis/core/geometry';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import WMSLayer from '@arcgis/core/layers/WMSLayer';
import { SimpleRenderer } from '@arcgis/core/renderers';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import MapView from '@arcgis/core/views/MapView';

export interface ImageryFootprintLayerProperties extends __esri.FeatureLayerProperties {
  footprints: Collection<ImageryFootprint> | ImageryFootprint[];
  fillSymbol?: __esri.SimpleFillSymbol;
  wmsLayerName: string;
  wmsUrl: string;
}

interface PolygonGraphic<T extends object> extends __esri.Graphic {
  attributes: T;
  geometry: __esri.Polygon;
}

export type ImageryFootprintAttributes = {
  footprintId: string;
  title: string;
  timestamp: string;
  [key: string]: unknown;
};

export type ImageryFootprint = PolygonGraphic<ImageryFootprintAttributes>;

const DEFAULT_FILL_SYMBOL = new SimpleFillSymbol({
  color: new Color([255, 129, 50, 0.2]),
  outline: {
    color: new Color([255, 129, 50, 0.5]),
    width: 1,
  },
});

/**
 * The ImageryFootprintLayer class
 */
@subclass('custom.ImageryFootprintLayer')
export class ImageryFootprintLayer extends FeatureLayer {
  private _footprints: Collection<ImageryFootprint> = new Collection();
  private lastEditOperation: Promise<void | __esri.EditsResult> = Promise.resolve();

  @property({ readOnly: true })
  get imageryFootprints(): Collection<ImageryFootprint> {
    return this._footprints;
  }

  @property()
  style: __esri.SimpleFillSymbol;

  @property({ readOnly: true })
  wmsLayerName: string;

  @property({ readOnly: true })
  wmsUrl: string;

  @property({ readOnly: true })
  subLayers: Collection<{
    layer: WMSLayer;
    timestamp: string;
    id: string;
  }> = new Collection();

  get selectedFootprints(): Array<string> {
    return Array.from(this.subLayers.map((subLayer) => subLayer.id));
  }

  private isSelectedFootprint(footprintId: string): boolean {
    return this.subLayers.some((subLayer) => subLayer.id === footprintId);
  }

  private clickHandler: IHandle | null = null;
  private hoverHandler: IHandle | null = null;

  private onMapHandler: IHandle | null = null;
  private offMapHandler: IHandle | null = null;
  private activeHover: boolean = true;

  private highlightedFootprint: ImageryFootprint | null = null;
  private highlightHandle: IHandle | null = null;

  constructor(properties: ImageryFootprintLayerProperties) {
    super({
      source: [],
      fields: [
        {
          name: 'objectid',
          alias: 'Object ID',
          type: 'oid',
        },
        {
          name: 'footprintId',
          alias: 'Granule ID',
          type: 'string',
        },
        {
          name: 'title',
          alias: 'Title',
          type: 'string',
        },
        {
          name: 'timestamp',
          alias: 'Timestamp',
          type: 'date',
        },
      ],
      refreshInterval: 0.001,
      objectIdField: 'objectid',
      outFields: ['*'],
      geometryType: 'polygon',
      renderer: new SimpleRenderer({
        symbol: properties.fillSymbol ?? DEFAULT_FILL_SYMBOL,
        label: 'Imagery Footprint',
      }),
      spatialReference: SpatialReference.WGS84,
      popupEnabled: false,
      legendEnabled: true,

      ...properties,
      title: `${properties.title} Footprints`,
    });
    this.applyEdits({ addFeatures: properties.footprints });

    this.style = properties.fillSymbol ?? DEFAULT_FILL_SYMBOL;
    this.wmsLayerName = properties.wmsLayerName;
    this.wmsUrl = properties.wmsUrl;

    this._footprints = new Collection(properties.footprints);

    this._footprints.on('after-changes', () => {
      this.lastEditOperation = this.lastEditOperation
        .then(async () => {
          const currentFeatures = await this.queryFeatures({ where: '1=1' });
          const newFeatures = this._footprints;

          return this.applyEdits({
            deleteFeatures: currentFeatures.features,
            addFeatures: newFeatures,
          });
        })
        .catch((error) => {
          console.error('Error applying edits:', error);
        });
    });

    // Set up event handlers
    this.on('layerview-create', (event) => {
      const { view } = event;
      if (view && view instanceof MapView) {
        this.setupEventHandlers(view, event.layerView as __esri.FeatureLayerView);
      }
    });
  }

  private setupEventHandlers(view: __esri.MapView, layerView: __esri.FeatureLayerView): void {
    // Clean up existing handlers
    this.removeEventHandlers();

    // Set up click handler
    this.clickHandler = view.on('click', async (event) => {
      const firstLayerGraphic = await this.getFirstGraphicFromHitTest(view, event);
      if (firstLayerGraphic) {
        const attributes = firstLayerGraphic.attributes;

        if (this.isSelectedFootprint(attributes.footprintId)) {
          // already selected and added to the map
          return;
        }

        const wmsLayer = new WMSLayer({
          title: attributes.title,
          url: this.wmsUrl,
          id: attributes.footprintId,
          sublayers: [
            {
              name: this.wmsLayerName,
            },
          ],
          timeExtent: {
            start: new Date(attributes.timestamp),
            end: new Date(attributes.timestamp),
          },

          visible: true,
        });

        this.subLayers.add({
          layer: wmsLayer,
          timestamp: attributes.timestamp,
          id: attributes.footprintId,
        });

        view.goTo(firstLayerGraphic.geometry);
      }
    });

    // Set up pointer handlers for hover effects
    this.hoverHandler = reactiveUtils.on(
      () => view,
      'pointer-move',
      (event) => this.hoverHitTest(event, view, layerView),
    );

    // Set up off map handler
    this.offMapHandler = reactiveUtils.on(
      () => view,
      'pointer-leave',
      () => {
        this.activeHover = false;
      },
    );

    // Set up on map handler
    this.onMapHandler = reactiveUtils.on(
      () => view,
      'pointer-enter',
      () => (this.activeHover = true),
    );
  }

  private removeEventHandlers(): void {
    if (this.clickHandler) {
      this.clickHandler.remove();
      this.clickHandler = null;
    }
    if (this.hoverHandler) {
      this.hoverHandler.remove();
      this.hoverHandler = null;
    }
    if (this.offMapHandler) {
      this.offMapHandler.remove();
      this.offMapHandler = null;
    }
    if (this.onMapHandler) {
      this.onMapHandler.remove();
      this.onMapHandler = null;
    }
  }

  private async getFirstGraphicFromHitTest(
    mapView: __esri.MapView,
    event: __esri.MapViewScreenPoint | MouseEvent,
  ): Promise<ImageryFootprint | null> {
    const response = await mapView.hitTest(event, { include: [this] });
    const hitGraphics = response.results.filter(
      (result) => result.type === 'graphic',
    ) as __esri.GraphicHit[];

    const firstGraphic = hitGraphics[0]?.graphic;
    return firstGraphic ? (firstGraphic as ImageryFootprint) : null;
  }

  /**
   * performs a hit test on the mapView object. The function is decorated with the throttle
   * function which limits the rate at which the function can be executed.
   */
  private hoverHitTest = debounce(
    async (
      event: __esri.MapViewScreenPoint | MouseEvent,
      mapView: __esri.MapView,
      layerView: __esri.FeatureLayerView,
    ) => {
      const firstLayerGraphic = await this.getFirstGraphicFromHitTest(mapView, event);

      if (firstLayerGraphic && this.activeHover) {
        if (this.highlightedFootprint !== firstLayerGraphic) {
          mapView.container.style.cursor = 'pointer';
          this.highlightHandle?.remove();
          this.highlightHandle = layerView.highlight(firstLayerGraphic);
          this.highlightedFootprint = firstLayerGraphic;
        }
      } else {
        if (this.highlightedFootprint) {
          this.highlightHandle?.remove();
          mapView.container.style.cursor = 'default';
          this.highlightedFootprint = null;
        }
      }
    },
  );

  /**
   * Removes a specific child WMS layer
   */
  removeChildLayer(layerId: string): void {
    console.log('removeChildLayer', layerId);
    console.log(this.subLayers.forEach(({ layer }) => console.log(layer.id)));
    const layerIndex = this.subLayers.findIndex(({ layer }) => layer.id === layerId);
    if (layerIndex !== -1) {
      const { layer } = this.subLayers.at(layerIndex);
      if (layer) {
        layer.destroy();
      }
      this.subLayers.removeAt(layerIndex);
    }
  }

  /**
   * Removes all child WMS layers
   */
  removeAllChildLayers(): void {
    this.subLayers.forEach(({ layer }) => {
      layer.destroy();
    });
    this.subLayers.removeAll();
  }

  destroy(): void {
    this.removeEventHandlers();
    this.removeAllChildLayers();
    super.destroy();
  }
}
