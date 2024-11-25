export type MeasurementUnit =
  | 'meters'
  | 'kilometers'
  | 'feet'
  | 'yards'
  | 'miles'
  | 'nautical-miles';

export type MeasurementToolOptions = {
  textSymbol?: __esri.TextSymbolProperties;
  sketchOptions?: __esri.SketchViewModelProperties;
  graphicsLayer?: __esri.GraphicsLayer;
};

export interface LineGraphic<T extends object> extends __esri.Graphic {
  attributes: T;
  geometry: __esri.Polyline;
}

export type MeasurementLineAttributes = {
  measurementGroupId: string;
  lineId: string;
  type: 'measurement-line';
  length: number;
  unit: MeasurementUnit;
};

export interface PointGraphic<T extends object> extends __esri.Graphic {
  geometry: __esri.Point;
  attributes: T;
}

export type MeasurementLabelAttributes = {
  measurementGroupId: string;
  lineId: string;
  type: 'measurement-label';
  pathIndex: number;
  segmentIndex: number;
};

export type Coordinate = [number, number];
