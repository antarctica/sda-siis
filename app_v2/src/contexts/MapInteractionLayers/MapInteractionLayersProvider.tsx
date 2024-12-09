import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import React from 'react';

import { MapInteractionLayersContext } from './MapInteractionLayersContext';
import { MapInteractionLayersType } from './types';

export function MapInteractionLayersProvider({ children }: { children: React.ReactNode }) {
  const layers: MapInteractionLayersType = React.useMemo(() => {
    return {
      measurementInteraction: {
        layer: new GraphicsLayer({
          listMode: 'hide',
          title: 'Measurements',
        }),
        alwaysVisible: false,
      },
      shipPositionInteraction: {
        layer: new GraphicsLayer({
          listMode: 'hide',
          title: 'Ship Positions',
        }),
        alwaysVisible: true,
      },
      routesInteraction: {
        layer: new GraphicsLayer({
          listMode: 'hide',
          title: 'Routes',
        }),
        alwaysVisible: true,
      },
    };
  }, []);

  return (
    <MapInteractionLayersContext.Provider value={layers}>
      {children}
    </MapInteractionLayersContext.Provider>
  );
}
