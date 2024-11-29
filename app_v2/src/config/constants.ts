import Color from '@arcgis/core/Color';
import { Extent, Point, Polygon } from '@arcgis/core/geometry';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';

import { LabelledGraticuleLayerProperties } from '@/components/Map/layers/GraticuleLayer/LabelledGraticuleLayerClass';
import { MapCRS } from '@/types';
import { generateCircleRings } from '@/utils/mapUtils';

export const MAP_ID = 'SIIS_MAP';

export const FOOTPRINT_LAYER_NAME_SUFFIX = 'Footprints';

export function getDefaultCRSForLatitude(latitude: number): MapCRS {
  if (latitude < -55) {
    return MapCRS.ANTARCTIC;
  } else if (latitude > 55) {
    return MapCRS.ARCTIC;
  }
  return MapCRS.MERCATOR;
}

export function isPointVisibleInCRS(point: Point, crs: MapCRS): boolean {
  const extentConstraint = CRS_LOOKUP[crs].extentConstraint;
  return geometryEngine.contains(extentConstraint, point);
}

export const CRS_LOOKUP: Record<
  MapCRS,
  {
    wkid: number;
    hemisphere?: 'N' | 'S';
    center: [number, number];
    extentConstraint: Polygon | Extent;
    graticuleBounds: {
      minLatitude: number;
      maxLatitude: number;
    };
  }
> = {
  [MapCRS.MERCATOR]: {
    wkid: 3857,
    hemisphere: undefined,
    center: [0, 0],
    graticuleBounds: {
      minLatitude: -90,
      maxLatitude: 90,
    },
    extentConstraint: new Polygon({
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
    }),
  },

  [MapCRS.ARCTIC]: {
    wkid: 3413,
    hemisphere: 'N',
    center: [0, 90],
    graticuleBounds: {
      minLatitude: 50,
      maxLatitude: 89,
    },
    extentConstraint: new Polygon({
      rings: [generateCircleRings(64, 6291456)],
      spatialReference: {
        wkid: 3413,
      },
    }),
  },

  [MapCRS.ANTARCTIC]: {
    wkid: 3031,
    hemisphere: 'S',
    center: [0, -90],
    graticuleBounds: {
      minLatitude: -89,
      maxLatitude: -50,
    },
    extentConstraint: new Polygon({
      rings: [generateCircleRings(64, 6291456)],
      spatialReference: {
        wkid: 3031,
      },
    }),
  },
};

export const GRATICULE_LIGHT_STYLE: LabelledGraticuleLayerProperties['graticuleStyle'] = {
  line: {
    color: new Color([128, 128, 128, 0.8]),
    width: 1,
  },
  label: {
    color: new Color([0, 0, 0, 1]),
    font: {
      family: 'Inter',
      size: 8,
    },
    haloColor: new Color([255, 255, 255, 0.7]),
    haloSize: 0.5,
  },
};

export const GRATICULE_DARK_STYLE: LabelledGraticuleLayerProperties['graticuleStyle'] = {
  line: {
    color: new Color([128, 128, 128, 0.8]),
    width: 1,
  },
  label: {
    color: new Color([255, 255, 255, 1]),
    font: {
      family: 'Inter',
      size: 8,
    },
    haloColor: new Color([0, 0, 0, 0.7]),
    haloSize: 0.5,
  },
};
