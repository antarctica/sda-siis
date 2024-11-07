import Color from '@arcgis/core/Color';
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import Collection from '@arcgis/core/core/Collection.js';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import { SpatialReference } from '@arcgis/core/geometry';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import WMSLayer from '@arcgis/core/layers/WMSLayer';
import { SimpleRenderer } from '@arcgis/core/renderers';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import MapView from '@arcgis/core/views/MapView';

import { throttleAsync } from '@/utils/throttle';

export interface ImageryFootprintLayerProperties extends __esri.FeatureLayerProperties {
  footprints: ImageryFootprint[];
  fillSymbol?: __esri.SimpleFillSymbol;
  wmsLayerName: string;
  wmsUrl: string;
}

interface PolygonGraphic<T extends object> extends __esri.Graphic {
  attributes: T;
  geometry: __esri.Polygon;
}

export type ImageryFootprintAttributes = {
  footprintId: number;
  title: string;
  timestamp: string;
  [key: string]: unknown;
};

export type ImageryFootprint = PolygonGraphic<ImageryFootprintAttributes>;

const DEFAULT_FILL_SYMBOL = new SimpleFillSymbol({
  color: new Color([0, 0, 0, 0.1]),
  outline: {
    color: new Color([255, 255, 255, 0.4]),
    width: 1,
  },
});

/**
 * The ImageryFootprintLayer class
 */
@subclass('custom.ImageryFootprintLayer')
export class ImageryFootprintLayer extends FeatureLayer {
  @property()
  style: __esri.SimpleFillSymbol;

  @property({ readOnly: true })
  wmsLayerName: string;

  @property({ readOnly: true })
  wmsUrl: string;

  @property({ readOnly: true })
  subLayers: Collection<{
    layer: WMSLayer;
    id: number;
  }> = new Collection();

  get selectedFootprints(): Array<number> {
    return Array.from(this.subLayers.map((subLayer) => subLayer.id));
  }

  private isSelectedFootprint(footprintId: number): boolean {
    return this.subLayers.some((subLayer) => subLayer.id === footprintId);
  }

  private clickHandler: IHandle | null = null;
  private hoverHandler: IHandle | null = null;

  private highlightedFootprint: ImageryFootprint | null = null;
  private highlightHandle: IHandle | null = null;

  constructor(properties: ImageryFootprintLayerProperties) {
    super({
      source: properties.footprints,
      fields: [
        {
          name: 'footprintId',
          alias: 'Granule ID',
          type: 'oid',
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
      objectIdField: 'footprintId',
      outFields: ['*'],
      geometryType: 'polygon',
      renderer: new SimpleRenderer({
        symbol: properties.fillSymbol ?? DEFAULT_FILL_SYMBOL,
      }),
      spatialReference: SpatialReference.WGS84,
      popupEnabled: false,
      ...properties,
    });

    this.style = properties.fillSymbol ?? DEFAULT_FILL_SYMBOL;
    this.wmsLayerName = properties.wmsLayerName;
    this.wmsUrl = properties.wmsUrl;

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
          sublayers: [
            {
              name: this.wmsLayerName,
            },
          ],
          timeExtent: {
            start: new Date(attributes.timestamp),
            end: new Date(attributes.timestamp),
          },
          opacity: 0.9,
          visible: true,
        });

        this.subLayers.add({
          layer: wmsLayer,
          id: attributes.footprintId,
        });
      }
    });

    // Set up pointer handlers for hover effects
    this.hoverHandler = reactiveUtils.on(
      () => view,
      'pointer-move',
      (event) => this.hoverHitTest(event, view, layerView),
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
  private hoverHitTest = throttleAsync(
    async (
      event: __esri.MapViewScreenPoint | MouseEvent,
      mapView: __esri.MapView,
      layerView: __esri.FeatureLayerView,
    ) => {
      const firstLayerGraphic = await this.getFirstGraphicFromHitTest(mapView, event);

      if (firstLayerGraphic) {
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
    70,
  );

  /**
   * Removes a specific child WMS layer
   */
  removeChildLayer(layerId: string): void {
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
