import { components } from './api';

export enum MapCRS {
  ANTARCTIC = 'antarctic',
  ARCTIC = 'arctic',
  MERCATOR = 'mercator',
}

export type OGCType = 'WMTS' | 'WMS' | 'WMS-T' | 'WFS';

export type MapProduct = components['schemas']['product'];
export type MapGranule = components['schemas']['granule'];

export type LayerStatus = 'offline' | 'online' | 'loading' | 'static' | 'outdated' | 'error';
