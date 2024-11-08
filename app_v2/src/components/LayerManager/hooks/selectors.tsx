import { LayerManagerContext } from '../LayerManagerProvider';
import { getTopLevelLayersInOrder } from '../machines/utils';

export function useTopLevelLayers() {
  const layers = LayerManagerContext.useSelector(({ context }) => {
    return getTopLevelLayersInOrder(context.childLayerOrder, context.layers);
  });

  return layers;
}

export function useLayerStatus(layerId: string) {
  const status = LayerManagerContext.useSelector(({ context }) => {
    const layer = context.layers.find((layer) => layer.layerActor.id === layerId);
    return layer?.layerData?.params.status;
  });

  return status;
}
