import { useSelector } from '@xstate/react';
import React from 'react';

import { LayerManagerContext } from '../LayerManagerProvider';
import { LayerGroupMachineActor } from '../machines/types';
import { getLayerGroupChildrenInOrder, getTopLevelLayersInOrder } from '../machines/utils';

export function useTopLevelLayers() {
  const { childLayerOrder, layers } = LayerManagerContext.useSelector(({ context }) => ({
    childLayerOrder: context.childLayerOrder,
    layers: context.layers,
  }));

  const topLevelLayers = React.useMemo(
    () => getTopLevelLayersInOrder(childLayerOrder, layers),
    [childLayerOrder, layers],
  );

  return topLevelLayers;
}

export function useLayerGroupLayers(actor: LayerGroupMachineActor) {
  const { childLayerOrder, children } = useSelector(actor, ({ context }) => ({
    childLayerOrder: context.childLayerOrder,
    children: context.children,
  }));

  const layers = React.useMemo(
    () => getLayerGroupChildrenInOrder(childLayerOrder, children),
    [childLayerOrder, children],
  );

  return layers;
}

export function useLayerStatus(layerId: string) {
  const status = LayerManagerContext.useSelector(({ context }) => {
    const layer = context.layers.find((layer) => layer.layerActor.id === layerId);
    return layer?.layerData?.params.status;
  });

  return status;
}

export function useLayerDisplayMode(layerId: string) {
  const displayMode = LayerManagerContext.useSelector(({ context }) => {
    const layer = context.layers.find((layer) => layer.layerActor.id === layerId);
    return layer?.layerData?.params.displayMode;
  });

  return displayMode;
}
