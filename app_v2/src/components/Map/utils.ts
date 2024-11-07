import Polygon from '@arcgis/core/geometry/Polygon';
import Graphic from '@arcgis/core/Graphic';
import WFSLayer from '@arcgis/core/layers/WFSLayer';
import WMSLayer from '@arcgis/core/layers/WMSLayer';
import WMTSLayer from '@arcgis/core/layers/WMTSLayer';
import TimeExtent from '@arcgis/core/TimeExtent.js';

import { MapGranule, MapProduct, OGCType } from '@/types';

import { isSingleTimeInfo, LayerTimeInfo } from '../LayerManager/machines/types';
import { Theme } from '../Theme/useTheme';
import {
  ImageryFootprint,
  ImageryFootprintAttributes,
  ImageryFootprintLayer,
} from './layers/ImageryFootprintLayer/ImageryFootprintLayerClass';

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
  // priority order: WMS-T, WMTS, WMS, WFS
  return (
    ogcTypes.find((ogcType) => ogcType === 'WMS-T') ??
    ogcTypes.find((ogcType) => ogcType === 'WMTS') ??
    ogcTypes.find((ogcType) => ogcType === 'WMS') ??
    ogcTypes.find((ogcType) => ogcType === 'WFS')
  );
}

export function createWMTSLayer(layer: MapProduct, currentTheme: Theme, visible: boolean) {
  return new WMTSLayer({
    url: `${import.meta.env.VITE_SERVICE_API_OGC_ENDPOINT}/${layer.gs_wmtsendpoint}`,
    activeLayer: {
      id: layer.gs_layername,
      styleId: `${layer.style}.${convertThemeToStyle(currentTheme)}`,
    },
    title: layer.label,
    copyright: layer.attribution,
    visible,
  });
}

export function createWMSLayer(
  layer: MapProduct,
  currentTheme: Theme,
  visible: boolean,
  timeInfo?: LayerTimeInfo,
) {
  let timeExtent: __esri.TimeExtent | undefined;

  if (isSingleTimeInfo(timeInfo)) {
    // generate a range over the entire day of the timeInfo.value
    const start = new Date(timeInfo.value);
    start.setHours(0, 0, 0, 0);
    const end = new Date(timeInfo.value);
    end.setHours(23, 59, 59, 999);
    timeExtent = new TimeExtent({
      start,
      end,
    });
  }

  return new WMSLayer({
    url: `${import.meta.env.VITE_SERVICE_API_OGC_ENDPOINT}/${layer.gs_wmsendpoint}`,
    title: layer.label,
    sublayers: [
      {
        name: layer.gs_layername,
      },
    ],
    customLayerParameters: {
      STYLES: `${layer.style}.${convertThemeToStyle(currentTheme)}`,
    },
    spatialReference: {
      wkid: 3031,
    },
    copyright: layer.attribution,
    visible,
    useViewTime: false,
    timeExtent,
  });
}

export function createWFSLayer(layer: MapProduct, visible: boolean) {
  return new WFSLayer({
    url: `${import.meta.env.VITE_SERVICE_API_OGC_ENDPOINT}/${layer.gs_wfsendpoint}`,
    title: layer.label,
    name: layer.gs_layername,
    visible,
  });
}

export function createImageryFootprintLayer(
  layer: MapProduct,
  granules: MapGranule[],
  visible: boolean,
) {
  const footprints = granules.map(({ geojson_extent, filename_dl, timestamp, id }) => {
    if (!geojson_extent || !geojson_extent.coordinates) return;

    // Create a Polygon from GeoJSON
    const polygonGeometry = new Polygon({
      rings: geojson_extent.coordinates[0],
      spatialReference: { wkid: 4326 }, // WGS84
    });

    const attributes: ImageryFootprintAttributes = {
      title: filename_dl ?? '',
      timestamp: timestamp ?? '',
      footprintId: id ?? 0,
      wmsUrl: layer.gs_wmsendpoint ?? '',
    };

    return new Graphic({
      geometry: polygonGeometry,
      attributes,
    }) as ImageryFootprint;
  });

  return new ImageryFootprintLayer({
    footprints: footprints.filter(Boolean) as ImageryFootprint[],
    wmsLayerName: layer.gs_layername ?? '',
    wmsUrl: `${import.meta.env.VITE_SERVICE_API_OGC_ENDPOINT}/${layer.gs_wmsendpoint}`,
    visible,
  });
}

export function createOGCLayer(
  layer: MapProduct,
  ogcType: OGCType,
  currentTheme: Theme,
  visible: boolean,
  timeInfo?: LayerTimeInfo,
) {
  switch (ogcType) {
    case 'WMTS':
      return createWMTSLayer(layer, currentTheme, visible);
    case 'WMS':
    case 'WMS-T':
      return createWMSLayer(layer, currentTheme, visible, timeInfo);
    case 'WFS':
      return createWFSLayer(layer, visible);
  }
}

export function convertThemeToStyle(theme: Theme) {
  return theme === 'dark' ? 'night' : 'day';
}
