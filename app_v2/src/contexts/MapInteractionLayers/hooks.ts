import { useContext } from 'react';

import { MapInteractionLayersContext } from './MapInteractionLayersContext';

export function useMapInteractionLayers() {
  const context = useContext(MapInteractionLayersContext);
  if (!context) {
    throw new Error('useMapInteractionLayers must be used within a MapInteractionLayersProvider');
  }
  return context;
}
