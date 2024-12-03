import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import React from 'react';

import { MapInteractionLayersContext } from './MapInteractionLayersContext';

export function MapInteractionLayersProvider({ children }: { children: React.ReactNode }) {
  const layers = React.useMemo(() => {
    return {
      measurementLayer: new GraphicsLayer({
        listMode: 'hide',
        title: 'Measurements',
      }),
      shipPositionLayer: new GraphicsLayer({
        listMode: 'hide',
        title: 'Ship Positions',
      }),
      routesLayer: new GraphicsLayer({
        listMode: 'hide',
        title: 'Routes',
      }),
    };
  }, []);

  return (
    <MapInteractionLayersContext.Provider value={layers}>
      {children}
    </MapInteractionLayersContext.Provider>
  );
}
