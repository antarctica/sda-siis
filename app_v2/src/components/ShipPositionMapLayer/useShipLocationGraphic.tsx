import { Point } from '@arcgis/core/geometry';
import React from 'react';

import { useShipHeading } from '@/api/useShipSensorData';
import { useCurrentMapView, useWatchEffect } from '@/arcgis/hooks';
import { ProjectionContext } from '@/arcgis/projection/ProjectionProvider';
import { selectFollowShip } from '@/store/features/shipSlice';
import { useAppSelector } from '@/store/hooks';
import { MapCRS } from '@/types';

import { setOrUpdateShipGraphic } from './utils';

export function useShipLocationGraphic(
  graphicsLayer: __esri.GraphicsLayer | undefined,
  position: { latitude: number; longitude: number } | null,
  mapCRS: MapCRS,
) {
  const currentMapView = useCurrentMapView();
  const { heading } = useShipHeading();
  const { project } = React.useContext(ProjectionContext);
  const followShip = useAppSelector(selectFollowShip);

  React.useEffect(() => {
    if (!graphicsLayer || !position || !currentMapView) return;

    if (followShip) {
      const target = new Point(position);
      currentMapView.goTo({ target });
    }

    setOrUpdateShipGraphic(
      graphicsLayer,
      position,
      heading ?? 0,
      project,
      mapCRS,
      currentMapView.scale,
    );
  }, [graphicsLayer, position, heading, project, mapCRS, currentMapView, followShip]);

  useWatchEffect(
    () => currentMapView?.scale,
    (scale) => {
      if (graphicsLayer && position && scale) {
        setOrUpdateShipGraphic(graphicsLayer, position, heading ?? 0, project, mapCRS, scale);
      }
    },
  );
}
