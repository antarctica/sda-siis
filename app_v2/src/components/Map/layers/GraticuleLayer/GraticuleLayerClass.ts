/* eslint-disable react/no-is-mounted */

import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import { Point, SpatialReference } from '@arcgis/core/geometry';
import Polyline from '@arcgis/core/geometry/Polyline';
import { project } from '@arcgis/core/geometry/projection';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';

export interface GraticuleLayerProperties extends __esri.GraphicsLayerProperties {
  spatialReference?: __esri.SpatialReference;
  latitudeInterval?: number;
  longitudeInterval?: number;
  minLatitude?: number;
  maxLatitude?: number;
  lineColor?: number[];
  lineWidth?: number;
}

@subclass('custom.GraticuleLayer')
export class GraticuleLayer extends GraphicsLayer {
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
  spatialReference: __esri.SpatialReference = SpatialReference.WGS84;

  constructor(
    properties?: __esri.GraphicsLayerProperties & {
      latitudeInterval?: number;
      longitudeInterval?: number;
      minLatitude?: number;
      maxLatitude?: number;
      lineColor?: number[];
      lineWidth?: number;
      spatialReference?: __esri.SpatialReference;
    },
  ) {
    super(properties);

    if (properties) {
      this.latitudeInterval = properties.latitudeInterval ?? this.latitudeInterval;
      this.longitudeInterval = properties.longitudeInterval ?? this.longitudeInterval;
      this.minLatitude = properties.minLatitude ?? this.minLatitude;
      this.maxLatitude = properties.maxLatitude ?? this.maxLatitude;
      this.lineColor = properties.lineColor ?? this.lineColor;
      this.lineWidth = properties.lineWidth ?? this.lineWidth;
      this.spatialReference = properties.spatialReference ?? this.spatialReference;
    }

    this.createGraticule();
  }

  private createGraticule(): void {
    // Create latitude lines
    for (
      let lat = Math.max(-89, this.minLatitude);
      lat <= Math.min(89, this.maxLatitude);
      lat += this.latitudeInterval
    ) {
      const points = [];
      for (let lon = -180; lon <= 180; lon += 1) {
        const point = new Point({
          longitude: lon,
          latitude: lat,
          spatialReference: SpatialReference.WGS84,
        });
        const projectedPoint = project(point, this.spatialReference) as __esri.Point;
        points.push([projectedPoint.x, projectedPoint.y]);
      }

      const polyline = new Polyline({
        paths: [points],
        spatialReference: this.spatialReference,
      });

      const graphic = new Graphic({
        geometry: polyline,
        symbol: new SimpleLineSymbol({
          color: this.lineColor,
          width: this.lineWidth,
        }),
      });

      this.add(graphic);
    }

    // Create longitude lines
    for (let lon = -180; lon <= 180; lon += this.longitudeInterval) {
      const points = [];
      for (
        let lat = Math.max(-89, this.minLatitude);
        lat <= Math.min(89, this.maxLatitude);
        lat += 1
      ) {
        const point = new Point({
          longitude: lon,
          latitude: lat,
          spatialReference: SpatialReference.WGS84,
        });
        const projectedPoint = project(point, this.spatialReference) as __esri.Point;
        points.push([projectedPoint.x, projectedPoint.y]);
      }

      const polyline = new Polyline({
        paths: [points],
        spatialReference: this.spatialReference,
      });

      const graphic = new Graphic({
        geometry: polyline,
        symbol: new SimpleLineSymbol({
          color: this.lineColor,
          width: this.lineWidth,
        }),
      });

      this.add(graphic);
    }
  }

  public refresh(): void {
    console.log('refresh');
    this.removeAll();
    this.createGraticule();
  }
}
