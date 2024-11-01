import { LayerGroupContext, ManagedItem } from './types';

export function isValidLayerIndex(index: number, length: number): boolean {
  return index >= 0 && index <= length;
}

export function getFlatLayerOrder<T>(
  layers: ManagedItem<T>[],
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

// The bottom-most layer has an index of 0 and is at the bottom
// of the layer view stack on the map.
export function updateLayerOrder(
  currentOrder: string[],
  newLayerId: string,
  index?: number,
  position?: 'top' | 'bottom',
): string[] {
  const newOrder = [...currentOrder];
  if (index !== undefined && isValidLayerIndex(index, currentOrder.length)) {
    // insert the new layer after the index
    newOrder.splice(index, 0, newLayerId);
  } else if (position === 'top') {
    // top layer goes at the end of the array
    newOrder.push(newLayerId);
  } else {
    // bottom layer goes at the beginning of the array
    newOrder.unshift(newLayerId);
  }
  return newOrder;
}

export function getTopLevelLayersInOrder<T>(
  layerOrder: string[],
  layers: ManagedItem<T>[],
): ManagedItem<T>[] {
  return layerOrder
    .map((layerId) => layers.find((l) => l.layerActor.id === layerId))
    .filter((layer): layer is ManagedItem<T> => layer !== undefined);
}
