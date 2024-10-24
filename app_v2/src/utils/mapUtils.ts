import { Point } from '@arcgis/core/geometry';

import { MapCRS } from '@/types';

/**
 * Converts radians to degrees.
 * @param {number} radians - The angle in radians.
 * @returns {number} The angle in degrees.
 */
export function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Converts degrees to radians.
 * @param {number} degrees - The angle in degrees.
 * @returns {number} The angle in radians.
 */
export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculates the bearing between two points.
 * @param {number} x1 - The x-coordinate of the first point.
 * @param {number} y1 - The y-coordinate of the first point.
 * @param {number} x2 - The x-coordinate of the second point.
 * @param {number} y2 - The y-coordinate of the second point.
 * @returns {number} The bearing in degrees, normalized to 0-360 range.
 */
export function calculateBearing(x1: number, y1: number, x2: number, y2: number): number {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  const radians = Math.atan2(deltaX, deltaY);
  const degrees = toDegrees(radians);
  return (degrees + 360) % 360;
}

/**
 * Calculates the projected bearing to the pole.
 * @param {Object} position - The position object with latitude and longitude.
 * @param {Function} project - The projection function from the ArcGIS API.
 * @param {MapCRS.ANTARCTIC | MapCRS.ARCTIC} projection - The map projection to use.
 * @returns {number} The bearing to the pole in degrees, normalized to 0-360 range.
 */
export function calculateProjectedBearingToPole(
  position: { latitude: number; longitude: number },
  project: typeof __esri.projection.project,
  projection: MapCRS.ANTARCTIC | MapCRS.ARCTIC,
): number {
  const sourcePoint = new Point({
    latitude: position.latitude,
    longitude: position.longitude,
    spatialReference: { wkid: 4326 }, // WGS84
  });

  const targetSR =
    projection === MapCRS.ANTARCTIC
      ? { wkid: 3031 } // Antarctic Polar Stereographic
      : { wkid: 3413 }; // Arctic Polar Stereographic

  const projectedPoint = project(sourcePoint, targetSR) as __esri.Point;
  const bearing = calculateBearing(projectedPoint.x, projectedPoint.y, 0, 0);

  return (bearing + 360) % 360; // Normalize to 0-360 range
}

/**
 * Calculates the corrected heading based on the map projection.
 * @param {Object} position - The position object with latitude and longitude.
 * @param {number} heading - The original heading in degrees.
 * @param {Function} project - The projection function from the ArcGIS API.
 * @param {MapCRS} projection - The map projection to use.
 * @param {number} [symbolRotationToUp=0] - The symbol rotation to up in degrees.
 * @returns {number} The corrected heading in degrees, normalized to 0-360 range.
 */
export function calculateCorrectedHeading(
  position: { latitude: number; longitude: number },
  heading: number,
  project: typeof __esri.projection.project,
  projection: MapCRS,
  symbolRotationToUp: number = 0,
): number {
  if (projection === MapCRS.MERCATOR) {
    return (heading + symbolRotationToUp) % 360;
  }
  const bearingToPole = calculateProjectedBearingToPole(position, project, projection);
  const bearingToNorth =
    projection === MapCRS.ARCTIC ? bearingToPole : (bearingToPole - 180 + 360) % 360;

  return (heading + bearingToNorth + 360) % 360;
}

/**
 * Creates a smooth scaled symbol size based on the current map scale.
 * @param {number} scale - The current map scale.
 * @param {number} [minScale=32] - The minimum scale value.
 * @param {number} [maxScale=10] - The maximum scale value.
 * @param {number} [baseScale=100000000] - The base scale for normalization.
 * @param {number} [zoomedScale=10000] - The zoomed scale for normalization.
 * @returns {number} The calculated symbol size.
 */
export function createSmoothScaledSymbolSize(
  scale: number,
  minScale: number = 32,
  maxScale: number = 10,
  baseScale = 100000000,
  zoomedScale = 10000,
): number {
  const logBase4Scale = Math.log(scale) / Math.log(4);

  // Normalize the scale between a large zoom scale (e.g., 1,000,000) and a smaller zoom scale (e.g., 100)
  const normalizedScale =
    (logBase4Scale - Math.log(baseScale) / Math.log(4)) /
    (Math.log(zoomedScale) / Math.log(4) - Math.log(baseScale) / Math.log(4));

  // Ensure the size changes smoothly between minScale and maxScale
  const calculatedSize = minScale + (maxScale - minScale) * (1 - normalizedScale);

  // Clamp to ensure within bounds
  return Math.max(maxScale, Math.min(minScale, calculatedSize));
}
