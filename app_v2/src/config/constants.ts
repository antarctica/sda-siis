import { Extent, Polygon } from '@arcgis/core/geometry';

import { MapCRS } from '@/types';
function generateCircleRings(
  numVertices: number,
  radius: number,
  center: [number, number] = [0, 0],
): number[][] {
  const points: number[][] = [];
  const [centerX, centerY] = center;

  // Generate points around the circle
  for (let i = 0; i <= numVertices; i++) {
    // Use <= to close the circle by repeating the first point
    const angle = (i * 2 * Math.PI) / numVertices;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push([x, y]);
  }

  return points;
}

export const MAP_ID = 'SIIS_MAP';

export const FOOTPRINT_LAYER_NAME_SUFFIX = 'Footprints';

export const CRS_LOOKUP: Record<
  MapCRS,
  {
    wkid: number;
    hemisphere?: 'N' | 'S';
    center: [number, number];
    extentConstraint: Polygon | Extent;
  }
> = {
  [MapCRS.MERCATOR]: {
    wkid: 3857,
    hemisphere: undefined,
    center: [0, 0],
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
    extentConstraint: new Polygon({
      rings: [generateCircleRings(64, 6291456)],
      spatialReference: {
        wkid: 3031,
      },
    }),
  },
};
