import { Extent, Point, Polygon } from '@arcgis/core/geometry';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';

import { MapCRS } from '@/types';
import { generateCircleRings } from '@/utils/mapUtils';

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
