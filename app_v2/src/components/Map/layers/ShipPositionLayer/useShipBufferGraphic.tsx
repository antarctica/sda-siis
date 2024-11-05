import React from 'react';

import { useShipSpeed } from '@/api/useShipSensorData';
import { useCurrentMapView } from '@/arcgis/hooks';

import { setOrUpdateShipBufferGraphics } from './utils';

export function useShipBufferGraphic(
  featureLayer: __esri.FeatureLayer | undefined,
  position: { latitude: number; longitude: number } | null,
) {
  const currentMapView = useCurrentMapView();
  const { speed } = useShipSpeed();

  React.useEffect(() => {
    if (!featureLayer || !position || !currentMapView) return;

    setOrUpdateShipBufferGraphics(featureLayer, position, speed ?? 0);
  }, [featureLayer, position, speed, currentMapView]);
}
