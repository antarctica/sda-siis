import React from 'react';

import { useSIISMapView } from '@/hooks/useSIISMapView';

import { LayerManagerContext } from '../LayerManagerProvider';

export function useResetLayers() {
  const layerManagerActor = LayerManagerContext.useActorRef();
  const siisMapView = useSIISMapView();

  const reset = React.useCallback(() => {
    if (siisMapView) {
      siisMapView.map.removeAll();
    }
    layerManagerActor.send({ type: 'RESET' });
  }, [layerManagerActor, siisMapView]);
  return reset;
}
