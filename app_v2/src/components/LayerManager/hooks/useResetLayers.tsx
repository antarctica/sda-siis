import React from 'react';

import { LayerManagerContext } from '../LayerManagerProvider';

export function useResetLayers() {
  const layerManagerActor = LayerManagerContext.useActorRef();
  const reset = React.useCallback(() => {
    layerManagerActor.send({ type: 'RESET' });
  }, [layerManagerActor]);
  return reset;
}
