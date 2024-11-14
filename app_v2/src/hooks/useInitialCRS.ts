import { useEffect, useState } from 'react';

import { useShipPosition } from '@/api/useShipSensorData';
import { getDefaultCRSForLatitude } from '@/config/constants';
import { setCurrentCRS } from '@/store/features/projectionSlice';
import { useAppDispatch } from '@/store/hooks';

export function useInitialCRS() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { latitude, isLoading, isError } = useShipPosition();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoading && !isError && latitude !== null && !isInitialized) {
      const crs = getDefaultCRSForLatitude(latitude);
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
