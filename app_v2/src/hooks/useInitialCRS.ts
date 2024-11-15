import { useEffect, useRef, useState } from 'react';

import { useInitialShipPosition } from '@/api/useShipSensorData';
import { getDefaultCRSForLatitude } from '@/config/constants';
import { setCurrentCRS } from '@/store/features/projectionSlice';
import { useAppDispatch } from '@/store/hooks';
import { MapCRS } from '@/types';

export function useInitialCRS() {
  const [initialCRS, setInitialCRS] = useState<MapCRS | null>(null);
  const { latitude, isLoading, isError } = useInitialShipPosition();
  const dispatch = useAppDispatch();
  const hasProcessedPosition = useRef(false);

  useEffect(() => {
    if (
      !initialCRS &&
      !hasProcessedPosition.current &&
      !isLoading &&
      !isError &&
      latitude !== null
    ) {
      const crs = getDefaultCRSForLatitude(latitude);
      dispatch(setCurrentCRS(crs));
      setInitialCRS(crs);
      hasProcessedPosition.current = true;
    }
  }, [isLoading, isError, latitude, dispatch, initialCRS]);

  return initialCRS;
}
