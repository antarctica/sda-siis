import React from 'react';

import { LayerData, LayerManagerContext } from '../LayerManagerProvider';
import { LayerConfig, LayerGroupConfig } from '../machines/types';

export function useAddLayer() {
  const layerManagerActor = LayerManagerContext.useActorRef();

  const addLayer = React.useCallback(
    (
      map: __esri.Map,
      config: LayerConfig<LayerData> | LayerGroupConfig<LayerData>,
      visible: boolean = true,
      index?: number,
    ) => {
      if (config.layerData) {
        map.add(config.layerData);
      }

      layerManagerActor.send({ type: 'LAYER.ADD', layerConfig: config, visible, index });
    },
    [layerManagerActor],
  );

  return addLayer;
}
