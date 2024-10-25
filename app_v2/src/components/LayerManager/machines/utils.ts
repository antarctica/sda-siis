import { LayerGroupContext, MapLayer } from './types';

export function isValidLayerIndex(index: number, length: number): boolean {
  return index >= 0 && index <= length;
}

export function getFlatLayerOrder<T>(
  layers: MapLayer<T>[],
  topLevelLayerOrder: string[],
): string[] {
  const flatOrder: string[] = [];

  const traverseLayers = (layerIds: string[]) => {
    layerIds.forEach((layerId) => {
      const layer = layers.find((l) => l.layerActor.id === layerId);
      if (!layer) return;

      flatOrder.push(layerId);

      const snapshot = layer.layerActor.getSnapshot();
      if (snapshot.context.layerType === 'layerGroup') {
        const groupContext = snapshot.context as LayerGroupContext;
        traverseLayers(groupContext.childLayerOrder);
      }
    });
  };

  traverseLayers(topLevelLayerOrder);
  return flatOrder;
}

export function updateLayerOrder(
  currentOrder: string[],
  newLayerId: string,
  index?: number,
): string[] {
  let newOrder = [...currentOrder];
  if (index !== undefined && isValidLayerIndex(index, currentOrder.length)) {
    newOrder.splice(index, 0, newLayerId);
  } else {
    newOrder = [newLayerId, ...newOrder];
  }
  return newOrder;
}

export function getTopLevelLayersInOrder<T>(
  layerOrder: string[],
  layers: MapLayer<T>[],
): MapLayer<T>[] {
  return layerOrder
    .map((layerId) => layers.find((l) => l.layerActor.id === layerId))
    .filter((layer): layer is MapLayer<T> => layer !== undefined);
}
