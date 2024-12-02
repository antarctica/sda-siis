import { Point } from '@arcgis/core/geometry';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import React from 'react';

import { useCurrentMapView, useWatchEffect } from '@/features/arcgis/hooks';
import { useLayerView } from '@/features/arcgis/hooks/useLayerView';
import { selectFollowShip } from '@/store/features/shipSlice';
import { useAppSelector } from '@/store/hooks';
import { MapCRS } from '@/types';

import { setOrUpdateShipPositionGraphic } from './utils';

const shipPositionGraphicsLayer = new GraphicsLayer({
  id: 'graphics-layer',
  title: 'Ship Position',
});

export function ShipLocationGraphic({
  position,
  shipHeading,
  mapCRS,
}: {
  position: { latitude: number; longitude: number } | null;
  shipHeading: number | null;
  mapCRS: MapCRS;
}) {
  const currentMapView = useCurrentMapView();

  const { layer: graphicsLayer } = useLayerView<__esri.GraphicsLayer, __esri.GraphicsLayerView>(
    currentMapView,
    shipPositionGraphicsLayer,
  );

  const followShip = useAppSelector(selectFollowShip);

  React.useEffect(() => {
    if (!position || !currentMapView) return;

    if (followShip) {
      const target = new Point(position);
      currentMapView.goTo({ target });
    }

    setOrUpdateShipPositionGraphic(
      graphicsLayer,
      position,
      shipHeading ?? 0,
      mapCRS,
      currentMapView.rotation,
      currentMapView.scale,
    );
  }, [graphicsLayer, position, shipHeading, mapCRS, currentMapView, followShip]);

  useWatchEffect(
    () => [currentMapView?.scale, currentMapView?.rotation],
    ([scale, rotation]) => {
      if (graphicsLayer && position && scale && rotation !== undefined) {
        setOrUpdateShipPositionGraphic(
          graphicsLayer,
          position,
          shipHeading ?? 0,
          mapCRS,
          rotation,
          scale,
        );
      }
    },
  );

  return null;
}
