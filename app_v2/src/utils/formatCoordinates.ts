export type DisplayFormat = 'DD' | 'DMS' | 'DDM';

// Utility functions for coordinate conversions
export function decimalToDMS(degree: number, isLat: boolean) {
  const absolute = Math.abs(degree);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);
  const direction = isLat ? (degree >= 0 ? 'N' : 'S') : degree >= 0 ? 'E' : 'W';
  return `${degrees}°${minutes}'${seconds}" ${direction}`;
}

export function decimalToDDM(degree: number, isLat: boolean) {
  const absolute = Math.abs(degree);
  const degrees = Math.floor(absolute);
  const minutes = ((absolute - degrees) * 60).toFixed(3);
  const direction = isLat ? (degree >= 0 ? 'N' : 'S') : degree >= 0 ? 'E' : 'W';
  return `${degrees}°${minutes}' ${direction}`;
}

export function formatLatitude(latitude: number) {
  const direction = latitude >= 0 ? 'N' : 'S';
  const absoluteValue = Math.abs(latitude).toFixed(2);
  return `${absoluteValue}° ${direction}`;
}

export function formatLongitude(longitude: number) {
  const direction = longitude >= 0 ? 'E' : 'W';
  const absoluteValue = Math.abs(longitude).toFixed(2);
  return `${absoluteValue}° ${direction}`;
}

export function formatCoordinate(
  lat: number | undefined,
  lon: number | undefined,
  format: DisplayFormat,
) {
  if (lat === undefined || lon === undefined) return null;

  switch (format) {
    case 'DD':
      return `${formatLatitude(lat)}, ${formatLongitude(lon)}`;
    case 'DMS':
      return `${decimalToDMS(lat, true)}, ${decimalToDMS(lon, false)}`;
    case 'DDM':
      return `${decimalToDDM(lat, true)}, ${decimalToDDM(lon, false)}`;
    default:
      return null;
  }
}

/**
 * Detects the coordinate format (dd, ddm, or dms) from a user's input.
 * @param input - The coordinate string input by the user.
 * @returns The detected coordinate format: 'DD', 'DDM', 'DMS', or 'unknown'.
 */
export function detectCoordinateFormat(input: string): DisplayFormat | 'unknown' {
  const coordinateString = normalizeCoordinateString(input);
  const latLon = splitCoordinateString(coordinateString);

  if (!latLon) {
    return 'unknown';
  }

  const [latString, lonString] = latLon;

  const latFormat = detectFormatForCoordinate(latString);
  const lonFormat = detectFormatForCoordinate(lonString);

  if (latFormat === lonFormat && latFormat !== 'unknown') {
    return latFormat;
  } else {
    return 'unknown';
  }
}

/**
 * Normalizes the coordinate string by replacing various symbols with standard ones
 * and trimming unnecessary whitespace.
 * @param s - The coordinate string to normalize.
 * @returns The normalized coordinate string.
 */
function normalizeCoordinateString(s: string): string {
  // Replace degree symbols with '°'
  s = s.replace(/[\*\^\~º°]/g, '°');

  // Replace minute symbols with "'"
  s = s.replace(/['′]/g, "'");

  // Replace second symbols with '"'
  s = s.replace(/["″]/g, '"');

  // Replace multiple spaces with a single space
  s = s.replace(/\s+/g, ' ');

  // Trim leading/trailing whitespace
  s = s.trim();

  return s;
}

/**
 * Splits the coordinate string into latitude and longitude components.
 * @param coordinateString - The coordinate string to split.
 * @returns A tuple containing the latitude and longitude strings, or null if unable to split.
 */
function splitCoordinateString(coordinateString: string): [string, string] | null {
  // Try to split based on comma, vertical bar, or space
  const latLon = coordinateString
    .split(/[,\|]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (latLon.length === 2 && latLon[0] && latLon[1]) {
    return [latLon[0], latLon[1]];
  }

  // Try to split based on N/S/E/W indicators
  const regex = /([^NS]*[NS])\s*([^EW]*[EW])/i;
  const match = coordinateString.match(regex);

  if (match && match[1] && match[2]) {
    return [match[1].trim(), match[2].trim()];
  }

  // Try to split based on the number of numerical components
  const tokens = coordinateString.split(/\s+/).filter((s) => s.length > 0);

  if (tokens.length >= 4) {
    const mid = Math.floor(tokens.length / 2);
    const latTokens = tokens.slice(0, mid).join(' ');
    const lonTokens = tokens.slice(mid).join(' ');
    return [latTokens, lonTokens];
  }

  // Unable to split
  return null;
}

/**
 * Detects the coordinate format for a single coordinate component.
 * @param coordinate - The coordinate string (latitude or longitude).
 * @returns The detected format: 'dd', 'ddm', 'dms', or 'unknown'.
 */
function detectFormatForCoordinate(coordinate: string): DisplayFormat | 'unknown' {
  switch (true) {
    case isDD(coordinate):
      return 'DD';
    case isDMS(coordinate):
      return 'DMS';
    case isDDM(coordinate):
      return 'DDM';

    default:
      return 'unknown';
  }
}

/**
 * Checks if the coordinate is in DMS format.
 * @param coordinate - The coordinate string to check.
 * @returns True if the coordinate is in DMS format, false otherwise.
 */
function isDMS(coordinate: string): boolean {
  const regexDMS =
    /^\s*([+-]?)(\d+)\s*[°\*\^\~º]?\s*(\d+)\s*['′]?\s*(\d+(\.\d+)?)\s*["″]?\s*([NSEW])?\s*$/i;
  return regexDMS.test(coordinate);
}

/**
 * Checks if the coordinate is in DDM format.
 * @param coordinate - The coordinate string to check.
 * @returns True if the coordinate is in DDM format, false otherwise.
 */
function isDDM(coordinate: string): boolean {
  const regexDDM = /^\s*([+-]?)(\d+)\s*[°\*\^\~º]?\s*(\d+(\.\d+)?)\s*['′]?\s*([NSEW])?\s*$/i;
  return regexDDM.test(coordinate);
}

/**
 * Checks if the coordinate is in DD format.
 * @param coordinate - The coordinate string to check.
 * @returns True if the coordinate is in DD format, false otherwise.
 */
function isDD(coordinate: string): boolean {
  const regexDD = /^\s*([+-]?)(\d+(\.\d+)?)\s*°?\s*([NSEW])?\s*$/i;
  return regexDD.test(coordinate);
}
