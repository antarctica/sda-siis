import { Point, SpatialReference } from '@arcgis/core/geometry';
import * as bufferOperator from '@arcgis/core/geometry/operators/bufferOperator.js';
import { project } from '@arcgis/core/geometry/projection';
import { useEffect, useState } from 'react';

import { useInitialShipPosition } from '@/api/useShipSensorData';
import { CRS_LOOKUP, getDefaultCRSForLatitude } from '@/config/map';
import { setNewCRS } from '@/store/features/projectionSlice';
import { useAppDispatch } from '@/store/hooks';
import { MapCRS } from '@/types';

export function useInitialCRS() {
  const [initialCRS, setInitialCRS] = useState<MapCRS | null>(null);
  const { latitude, longitude, isLoading, isError } = useInitialShipPosition();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!initialCRS && !isLoading) {
      const crs =
        !isError && latitude !== null ? getDefaultCRSForLatitude(latitude) : MapCRS.ANTARCTIC;

      // create an extent that is 50km in all directions from the ship position
      // this must be in the crs of the ship position
      const shipPosition = new Point({
        x: longitude ?? 0,
        y: latitude ?? 0,
      });

      const shipPositionInCRS = project(
        shipPosition,
        new SpatialReference({ wkid: CRS_LOOKUP[crs].wkid }),
      ) as Point;

      const bufferedPoint = bufferOperator.execute(shipPositionInCRS, 50000);
      console.log(bufferedPoint.extent.toJSON());

      dispatch(setNewCRS({ crs, extentJson: bufferedPoint.extent.toJSON() }));
      setInitialCRS(crs);
    }
  }, [isLoading, isError, latitude, dispatch, initialCRS, longitude]);

  return initialCRS;
}
