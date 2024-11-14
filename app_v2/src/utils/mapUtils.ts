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
  projection: MapCRS.ANTARCTIC | MapCRS.ARCTIC,
): number {
  const bearing = position.longitude;
  const centralMeridianCorrection = projection === MapCRS.ANTARCTIC ? 0 : -45;
  return (bearing + centralMeridianCorrection + 360) % 360; // Normalize to 0-360 range
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
  projection: MapCRS,
  symbolRotationToUp: number = 0,
): number {
  if (projection === MapCRS.MERCATOR) {
    return (heading + symbolRotationToUp) % 360;
  }
  const bearingToPole = calculateProjectedBearingToPole(position, projection);

  return (heading + bearingToPole + 360) % 360;
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

/**
 * Generates a circle of points around a center point.
 * @param {number} numVertices - The number of vertices to generate.
 * @param {number} radius - The radius of the circle.
 * @param {Array<number>} [center=[0, 0]] - The center point of the circle.
 * @returns {Array<Array<number>>} An array of points representing the circle.
 */
export function generateCircleRings(
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
  console.log(points);
  return points;
}
