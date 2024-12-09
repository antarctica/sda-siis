import { Extent, Point, Polygon, SpatialReference } from '@arcgis/core/geometry';
import * as intersectsOperator from '@arcgis/core/geometry/operators/intersectsOperator.js';
import * as withinOperator from '@arcgis/core/geometry/operators/withinOperator.js';
import { project } from '@arcgis/core/geometry/projection';

import { MapCRS } from '@/types';
import { generateCircleRings } from '@/utils/mapUtils';

export function getDefaultCRSForLatitude(latitude: number): MapCRS {
  if (latitude < -50) {
    return MapCRS.ANTARCTIC;
  } else if (latitude > 50) {
    return MapCRS.ARCTIC;
  }
  return MapCRS.MERCATOR;
}

export function isPointVisibleInCRS(point: Point, crs: MapCRS): boolean {
  const extentConstraint = CRS_LOOKUP[crs].extentConstraint;
  return withinOperator.execute(point, extentConstraint);
}

export function validateExtentInCRS(extent: Extent, crs: MapCRS): Extent | undefined {
  const extentInCRS = project(extent, new SpatialReference({ wkid: CRS_LOOKUP[crs].wkid })) as
    | Extent
    | undefined;

  if (!extentInCRS) {
    return undefined;
  }

  const extentConstraint = CRS_LOOKUP[crs].extentConstraint;
  return intersectsOperator.execute(extentInCRS, extentConstraint) ? extentInCRS : undefined;
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
