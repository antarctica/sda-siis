import Polygon from '@arcgis/core/geometry/Polygon';
import WMSLayer from '@arcgis/core/layers/WMSLayer';
import WMTSLayer from '@arcgis/core/layers/WMTSLayer';

import { OGCType } from '@/types';
import { components } from '@/types/api';

// Prevent scrolling beyond the southern and northern poles on
// web mercator maps
export const GLOBAL_EXTENT = new Polygon({
  rings: [
    [
      [-20026376.39 * 16, -20048966.1],
      [-20026376.39 * 16, 20048966.1],
      [20026376.39 * 16, 20048966.1],
      [20026376.39 * 16, -20048966.1],
      [-20026376.39 * 16, -20048966.1],
    ],
  ],
  spatialReference: {
    wkid: 3857,
  },
});

export function ogcPriority(ogcTypes: OGCType[]): OGCType | undefined {
  // return the most preferrable OGC type
  // priority order: WMTS, WMS, WFS
  return (
    ogcTypes.find((ogcType) => ogcType === 'WMTS') ??
    ogcTypes.find((ogcType) => ogcType === 'WMS') ??
    ogcTypes.find((ogcType) => ogcType === 'WFS')
  );
}

type LayerProps = components['schemas']['product'];

export function createWMTSLayer(layer: LayerProps) {
  return new WMTSLayer({
    url: `${import.meta.env.VITE_SERVICE_API_OGC_ENDPOINT}/${layer.gs_wmtsendpoint}`,
    activeLayer: {
      id: layer.gs_layername,
      styleId: `${layer.style}.${'night'}`,
    },
    title: layer.label,
    copyright: layer.attribution,
  });
}

export function createWMSLayer(layer: LayerProps) {
  return new WMSLayer({
    url: `${import.meta.env.VITE_SERVICE_API_OGC_ENDPOINT}/${layer.gs_wmsendpoint}`,
    title: layer.label,
    sublayers: [
      {
        name: layer.gs_layername,
      },
    ],
    customLayerParameters: {
      STYLES: `${layer.style}.${'night'}`,
    },
    spatialReference: {
      wkid: 3031,
    },
    copyright: layer.attribution,
  });
}

export function createLayer(layer: LayerProps, ogcType: OGCType) {
  if (ogcType === 'WMTS') {
    return createWMTSLayer(layer);
  } else if (ogcType === 'WMS') {
    return createWMSLayer(layer);
  }
}
