import React from 'react';

import {
  decimalToDDM,
  decimalToDMS,
  formatLatitude,
  formatLongitude,
} from '@/utils/formatCoordinates';

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
