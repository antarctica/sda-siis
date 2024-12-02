import { Point, SpatialReference } from '@arcgis/core/geometry';
import { project } from '@arcgis/core/geometry/projection';
import { useMemo } from 'react';

import { useShipPosition } from '@/api/useShipSensorData';
import { CRS_LOOKUP, isPointVisibleInCRS } from '@/config/map';
import { selectCurrentCRS } from '@/store/features/projectionSlice';
import { useAppSelector } from '@/store/hooks';

export function useShipPositionWithVisibility() {
  const { latitude, longitude, isOnline, isLoading, isError, sensorStatus } = useShipPosition();
  const currentCRS = useAppSelector(selectCurrentCRS);

  const isVisible = useMemo(() => {
    if (!latitude || !longitude || !currentCRS) return false;

    return isPointVisibleInCRS(
      project(new Point({ latitude, longitude, spatialReference: SpatialReference.WGS84 }), {
        wkid: CRS_LOOKUP[currentCRS].wkid,
      }) as Point,
      currentCRS,
    );
  }, [latitude, longitude, currentCRS]);

  return {
    latitude,
    longitude,
    isOnline,
    isLoading,
    isError,
    sensorStatus,
    isVisible,
  };
}
