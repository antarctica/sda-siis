import { LayerManagerContext } from '../LayerManagerProvider';
import { getTopLevelLayersInOrder } from '../machines/utils';

export function useTopLevelLayers() {
  const layers = LayerManagerContext.useSelector(({ context }) => {
    console.log('context.childLayerOrder', context.childLayerOrder);
    return getTopLevelLayersInOrder(context.childLayerOrder, context.layers);
  });

  return layers;
}
