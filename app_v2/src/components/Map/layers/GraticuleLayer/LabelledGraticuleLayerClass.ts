/* eslint-disable react/no-is-mounted */
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import { SpatialReference } from '@arcgis/core/geometry';
import Polyline from '@arcgis/core/geometry/Polyline';
import Graphic from '@arcgis/core/Graphic';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { SimpleRenderer } from '@arcgis/core/renderers';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import MapView from '@arcgis/core/views/MapView';

export interface LabelledGraticuleLayerProperties extends __esri.FeatureLayerProperties {
  latitudeInterval?: number;
  longitudeInterval?: number;
  minLatitude?: number;
  maxLatitude?: number;
  lineColor?: number[];
  lineWidth?: number;
  labelColor?: number[];
  scaleIntervals?: {
    minScale: number;
    maxScale: number;
    latInterval: number;
    lonInterval: number;
  }[];
}

const MIN_LATITUDE = -89;
const MAX_LATITUDE = 89;

const DEFAULT_SCALE_INTERVALS: {
  minScale: number;
  maxScale: number;
  latInterval: number;
  lonInterval: number;
}[] = [
  {
    minScale: Infinity,
    maxScale: 20000000,
    latInterval: 10,
    lonInterval: 30,
  },
  {
    minScale: 20000000,
    maxScale: 5000000,
    latInterval: 5,
    lonInterval: 10,
  },
  {
    minScale: 5000000,
    maxScale: 1250000,
    latInterval: 1,
    lonInterval: 5,
  },
  {
    minScale: 1250000,
    maxScale: 0,
    latInterval: 0.5,
    lonInterval: 1,
  },
];

@subclass('custom.LabelledGraticuleLayer')
export class LabelledGraticuleLayer extends FeatureLayer {
  @property()
  latitudeInterval = 10;

  @property()
  longitudeInterval = 10;

  @property()
  minLatitude = -89;

  @property()
  maxLatitude = 89;

  @property()
  lineColor = [128, 128, 128, 1];

  @property()
  lineWidth = 1;

  @property()
  labelColor = [196, 196, 196, 1];

  @property()
  scaleIntervals = DEFAULT_SCALE_INTERVALS;

  private viewWatcher: IHandle | null = null;

  constructor(properties?: LabelledGraticuleLayerProperties) {
    // Create features for all intervals
    const features: Graphic[] = [];
    let objectId = 1;

    // Generate features for each interval in scaleIntervals
    (properties?.scaleIntervals ?? DEFAULT_SCALE_INTERVALS).forEach(
      ({ latInterval, lonInterval }) => {
        // Create latitude lines
        const minLat = Math.max(MIN_LATITUDE, properties?.minLatitude ?? MIN_LATITUDE);
        const maxLat = Math.min(MAX_LATITUDE, properties?.maxLatitude ?? MAX_LATITUDE);

        // Calculate the starting points for the interval lines from 90 and -90
        const latitudesToDraw = new Set<number>();

        // Add min and max boundaries
        latitudesToDraw.add(minLat);
        latitudesToDraw.add(maxLat);

        // Find the first interval line below 90 that's within bounds
        let lat = 90;
        while (lat >= minLat) {
          if (lat <= maxLat) {
            latitudesToDraw.add(lat);
          }
          lat -= latInterval;
        }

        // Find the first interval line above -90 that's within bounds
        lat = -90;
        while (lat <= maxLat) {
          if (lat >= minLat) {
            latitudesToDraw.add(lat);
          }
          lat += latInterval;
        }

        // Draw each latitude line
        latitudesToDraw.forEach((lat) => {
          // Break latitude lines into 4 segments: -180 to -90, -90 to 0, 0 to 90, 90 to 180
          const segments = [
            { start: -180, end: -90 },
            { start: -90, end: 0 },
            { start: 0, end: 90 },
            { start: 90, end: 180 },
          ];

          segments.forEach((segment) => {
            const points = [];
            for (let lon = segment.start; lon <= segment.end; lon += 0.5) {
              points.push([lon, lat]);
            }

            features.push(
              new Graphic({
                geometry: new Polyline({
                  paths: [points],
                  spatialReference: SpatialReference.WGS84,
                }),
                attributes: {
                  ObjectID: objectId++,
                  label: `${Math.abs(lat)}°${lat >= 0 ? 'N' : 'S'}`,
                  latInterval,
                  lonInterval,
                },
              }),
            );
          });
        });

        // Create longitude lines
        for (let lon = -180; lon <= 180; lon += lonInterval) {
          const points = [];
          for (
            let lat = Math.max(-89, properties?.minLatitude ?? -89);
            lat <= Math.min(89, properties?.maxLatitude ?? 89);
            lat += 1
          ) {
            points.push([lon, lat]);
          }

          features.push(
            new Graphic({
              geometry: new Polyline({
                paths: [points],
                spatialReference: SpatialReference.WGS84,
              }),
              attributes: {
                ObjectID: objectId++,
                label: `${Math.abs(lon)}°${lon >= 0 ? 'E' : 'W'}`,
                latInterval,
                lonInterval,
              },
            }),
          );
        }
      },
    );

    super({
      source: features,
      fields: [
        {
          name: 'ObjectID',
          alias: 'ObjectID',
          type: 'oid',
        },
        {
          name: 'label',
          alias: 'Label',
          type: 'string',
        },
        {
          name: 'latInterval',
          alias: 'Latitude Interval',
          type: 'double',
        },
        {
          name: 'lonInterval',
          alias: 'Longitude Interval',
          type: 'double',
        },
      ],
      objectIdField: 'ObjectID',
      geometryType: 'polyline',
      renderer: new SimpleRenderer({
        symbol: new SimpleLineSymbol({
          color: properties?.lineColor ?? [196, 196, 196, 1],
          width: properties?.lineWidth ?? 1,
        }),
      }),
      labelingInfo: [
        {
          labelExpressionInfo: {
            expression: '$feature.label',
          },
          symbol: {
            type: 'text',
            color: properties?.labelColor ?? [196, 196, 196, 1],
            font: {
              family: 'sans-serif',
              size: 9,
            },
            haloColor: [0, 0, 0, 0.7],
            haloSize: 0.1,
          },
          labelPlacement: 'center-along',
          repeatLabelDistance: 500,
          minScale: 0,
          maxScale: 0,
        },
      ],
      spatialReference: SpatialReference.WGS84,

      ...properties,
    });

    if (properties) {
      this.latitudeInterval = properties.latitudeInterval ?? this.latitudeInterval;
      this.longitudeInterval = properties.longitudeInterval ?? this.longitudeInterval;
      this.minLatitude = properties.minLatitude ?? this.minLatitude;
      this.maxLatitude = properties.maxLatitude ?? this.maxLatitude;
      this.lineColor = properties.lineColor ?? this.lineColor;
      this.lineWidth = properties.lineWidth ?? this.lineWidth;
      this.labelColor = properties.labelColor ?? this.labelColor;
    }

    this.on('layerview-create', (event) => {
      const { view } = event;
      if (this.viewWatcher) {
        this.viewWatcher.remove();
      }

      if (view && view instanceof MapView) {
        console.log(event.layerView);
        this.viewWatcher = reactiveUtils.watch(
          () => view.scale,
          () => {
            const level = this.scaleIntervals.find(
              (level) => view.scale < level.minScale && view.scale >= level.maxScale,
            );

            if (level) {
              const definitionExpression = `latInterval = ${level.latInterval} OR lonInterval = ${level.lonInterval}`;
              if (definitionExpression !== this.definitionExpression) {
                this.definitionExpression = definitionExpression;
              }
            }
          },
          { initial: true },
        );
      }
    });
  }

  destroy() {
    if (this.viewWatcher) {
      this.viewWatcher.remove();
      this.viewWatcher = null;
    }
    super.destroy();
  }
}
