import React from 'react';

import { LayerManagerContext } from '../LayerManagerProvider';

export function useRemoveLayer() {
  const layerManagerActor = LayerManagerContext.useActorRef();

  const removeLayer = React.useCallback(
    (map: __esri.Map, layerId: string) => {
      const layer = map.findLayerById(layerId);
      if (layer) {
        map.remove(layer);
      }

      layerManagerActor.send({
        type: 'LAYER.REMOVE',
        layerId: layerId,
      });
    },
    [layerManagerActor],
  );

  return removeLayer;
}
