import { useEffect, useState } from 'react';

import { useInitialShipPosition } from '@/api/useShipSensorData';
import { getDefaultCRSForLatitude } from '@/config/map';
import { setCurrentCRS } from '@/store/features/projectionSlice';
import { useAppDispatch } from '@/store/hooks';
import { MapCRS } from '@/types';

export function useInitialCRS() {
  const [initialCRS, setInitialCRS] = useState<MapCRS | null>(null);
  const { latitude, isLoading, isError } = useInitialShipPosition();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!initialCRS && !isLoading) {
      const crs =
        !isError && latitude !== null ? getDefaultCRSForLatitude(latitude) : MapCRS.ANTARCTIC;

      dispatch(setCurrentCRS(crs));
      setInitialCRS(crs);
    }
  }, [isLoading, isError, latitude, dispatch, initialCRS]);

  return initialCRS;
}
