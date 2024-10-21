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
