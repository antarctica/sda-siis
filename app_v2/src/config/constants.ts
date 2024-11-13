import { MapCRS } from '@/types';

export const MAP_ID = 'SIIS_MAP';

export const FOOTPRINT_LAYER_NAME_SUFFIX = 'Footprints';

export const WKID_LOOKUP: Record<MapCRS, number> = {
  [MapCRS.MERCATOR]: 3857,
  [MapCRS.ARCTIC]: 3413,
  [MapCRS.ANTARCTIC]: 3031,
};

export const CRS_TO_HEMISPHERE: Record<MapCRS, 'N' | 'S' | undefined> = {
  [MapCRS.MERCATOR]: undefined,
  [MapCRS.ARCTIC]: 'N',
  [MapCRS.ANTARCTIC]: 'S',
};
