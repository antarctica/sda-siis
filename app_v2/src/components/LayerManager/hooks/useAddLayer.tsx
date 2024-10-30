import React from 'react';

import { LayerData, LayerManagerContext } from '../LayerManagerProvider';
import { LayerConfig, LayerGroupConfig } from '../machines/types';

type MachineConfig = LayerConfig<LayerData> | LayerGroupConfig<LayerData>;
type LayerProps = MachineConfig & {
  visible?: boolean;
  index?: number;
  position?: 'top' | 'bottom';
};

export function useAddLayer() {
  const layerManagerActor = LayerManagerContext.useActorRef();

  const addLayer = React.useCallback(
    (map: __esri.Map, config: LayerProps) => {
      if (config.layerData) {
        map.add(config.layerData);
      }

      layerManagerActor.send({
        type: 'LAYER.ADD',
        layerConfig: config,
        visible: config.visible ?? true,
        index: config.index,
        position: config.position,
      });
    },
    [layerManagerActor],
  );

  return addLayer;
}
