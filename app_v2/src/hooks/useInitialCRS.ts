import { useEffect, useState } from 'react';

import { useShipPosition } from '@/api/useShipSensorData';
import { setCurrentCRS } from '@/store/features/projectionSlice';
import { useAppDispatch } from '@/store/hooks';
import { MapCRS } from '@/types';

function determineCRS(latitude: number): MapCRS {
  if (latitude < -55) {
    return MapCRS.ANTARCTIC;
  } else if (latitude > 55) {
    return MapCRS.ARCTIC;
  }
  return MapCRS.MERCATOR;
}

export function useInitialCRS() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { latitude, isLoading, isError } = useShipPosition();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoading && !isError && latitude !== null && !isInitialized) {
      const crs = determineCRS(latitude);
      dispatch(setCurrentCRS(crs));
      setIsInitialized(true);
    }
  }, [latitude, isLoading, isError, dispatch, isInitialized]);

  return {
    isInitialized,
    isLoading,
    isError,
  };
}
