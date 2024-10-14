import React from 'react';

// Utility functions for coordinate conversions
const decimalToDMS = (degree: number, isLat: boolean) => {
  const absolute = Math.abs(degree);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);
  const direction = isLat ? (degree >= 0 ? 'N' : 'S') : degree >= 0 ? 'E' : 'W';
  return `${degrees}°${minutes}'${seconds}" ${direction}`;
};

const decimalToDDM = (degree: number, isLat: boolean) => {
  const absolute = Math.abs(degree);
  const degrees = Math.floor(absolute);
  const minutes = ((absolute - degrees) * 60).toFixed(3);
  const direction = isLat ? (degree >= 0 ? 'N' : 'S') : degree >= 0 ? 'E' : 'W';
  return `${degrees}°${minutes}' ${direction}`;
};

const formatLatitude = (latitude: number) => {
  const direction = latitude >= 0 ? 'N' : 'S';
  const absoluteValue = Math.abs(latitude).toFixed(2);
  return `${absoluteValue}° ${direction}`;
};

const formatLongitude = (longitude: number) => {
  const direction = longitude >= 0 ? 'E' : 'W';
  const absoluteValue = Math.abs(longitude).toFixed(2);
  return `${absoluteValue}° ${direction}`;
};

// Custom hook for formatting latitude and longitude
const useFormattedLatLon = (
  lat: number | undefined,
  lon: number | undefined,
  format: 'DD' | 'DMS' | 'DDM',
) => {
  return React.useMemo(() => {
    if (lat === undefined || lon === undefined) return null;

    switch (format) {
      case 'DD':
        return `${formatLongitude(lon)}, ${formatLatitude(lat)}`;
      case 'DMS':
        return `${decimalToDMS(lon, false)}, ${decimalToDMS(lat, true)}`;
      case 'DDM':
        return `${decimalToDDM(lon, false)}, ${decimalToDDM(lat, true)}`;
      default:
        return null; // Optional fallback if an invalid format is passed
    }
  }, [lat, lon, format]);
};

export default useFormattedLatLon;
