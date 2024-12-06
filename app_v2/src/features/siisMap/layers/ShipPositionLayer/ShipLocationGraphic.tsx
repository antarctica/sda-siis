import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import { Point } from '@arcgis/core/geometry';
import React from 'react';

import { useMapInteractionLayers } from '@/contexts/MapInteractionLayers/hooks';
import { useCurrentMapView, useWatchEffect } from '@/features/arcgis/hooks';
import { useLayerView } from '@/features/arcgis/hooks/useLayerView';
import { selectFollowShip } from '@/store/features/shipSlice';
import { useAppSelector } from '@/store/hooks';
import { MapCRS } from '@/types';

import { setOrUpdateShipPositionGraphic } from './utils';

export function ShipLocationGraphic({
  position,
  visible,
  shipHeading,
  mapCRS,
}: {
  position: { latitude: number; longitude: number } | null;
  visible: boolean;
  shipHeading: number | null;
  mapCRS: MapCRS;
}) {
  const currentMapView = useCurrentMapView();
  const { shipPositionLayer } = useMapInteractionLayers();

  const { layer: graphicsLayer } = useLayerView<__esri.GraphicsLayer, __esri.GraphicsLayerView>(
    currentMapView,
    shipPositionLayer,
  );

  const followShip = useAppSelector(selectFollowShip);

  React.useEffect(() => {
    if (!position || !currentMapView) return;

    if (followShip && visible) {
      const target = new Point(position);
      reactiveUtils
        .whenOnce(() => !(currentMapView?.interacting || currentMapView?.animation))
        .then(() => {
          currentMapView.goTo({ target });
        });
    }

    setOrUpdateShipPositionGraphic(
      graphicsLayer,
      position,
      shipHeading ?? 0,
      mapCRS,
      currentMapView.rotation,
      currentMapView.scale,
    );
  }, [graphicsLayer, position, shipHeading, mapCRS, currentMapView, followShip, visible]);

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
