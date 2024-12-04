import { components } from './api';

export enum MapCRS {
  ANTARCTIC = 'antarctic',
  ARCTIC = 'arctic',
  MERCATOR = 'mercator',
}

export type OGCType = 'WMTS' | 'WMS' | 'WMS-T' | 'WFS';

export type LayerDisplayMode =
  | 'Static' // Non-temporal data
  | 'SingleTimeSlice' // Time-enabled data where only one time slice can be shown
  | 'MultipleTimeSliceCollection'; // Time-enabled data where multiple time slices can be shown as footprints

export type MapProduct = components['schemas']['product'];
export type MapGranule = components['schemas']['granule'];
export type LayerStatus = components['schemas']['product']['status'];
export type GranuleStatus = components['schemas']['granule']['status'];

export type LatLonFormat = 'DD' | 'DMS' | 'DDM';

export interface LineGraphic<T extends object> extends __esri.Graphic {
  attributes: T;
  geometry: __esri.Polyline;
}
