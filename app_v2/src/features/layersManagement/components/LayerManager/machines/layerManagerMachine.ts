import { assertEvent, assign, raise, setup, stopChild } from 'xstate';

import { layerGroupMachine } from './layers/layerGroupMachine';
import { layerMachine } from './layers/layerMachine';
import {
  isLayerGroupMachine,
  LayerGroupContext,
  LayerGroupMachineActor,
  LayerManagerEvent,
  LayerTimeInfo,
  ManagedItem,
  ParentLayerActor,
} from './types';
import { getFlatLayerOrder, updateLayerOrder } from './utils';

interface LayerManagerContext<T> {
  layers: ManagedItem<T>[];
  childLayerOrder: string[];
  allowNestedGroupLayers: boolean;
}

function findParentLayerGroupActor<T>(
  layers: ManagedItem<T>[],
  parentId: string,
): LayerGroupMachineActor | null {
  const layer = layers.find((layer) => layer.layerActor.id === parentId);

  if (!layer || !isLayerGroupMachine(layer.layerActor)) {
    return null;
  }

  return layer.layerActor;
}

function addLayerToParent<T>(
  layers: ManagedItem<T>[],
  newLayer: ManagedItem<T>,
  parentRef: ParentLayerActor,
  index?: number,
  position?: 'top' | 'bottom',
): Partial<LayerManagerContext<T>> {
  parentRef.send({ type: 'LAYERS.ADD_CHILD', child: newLayer.layerActor, index, position });
  return {
    layers: [...layers, newLayer],
  };
}

function addLayerToTopLevel<T>(
  layers: ManagedItem<T>[],
  newLayer: ManagedItem<T>,
  childLayerOrder: string[],
  index?: number,
  position?: 'top' | 'bottom',
): Partial<LayerManagerContext<T>> {
  const newLayerOrder = updateLayerOrder(childLayerOrder, newLayer.layerActor.id, index, position);
  return {
    layers: [...layers, newLayer],
    childLayerOrder: newLayerOrder,
  };
}

export function createLayerManagerMachine<T>() {
  return setup({
    types: {
      context: {} as LayerManagerContext<T>,
      events: {} as LayerManagerEvent<T>,
      input: {} as {
        allowNestedGroupLayers: boolean;
      },
    },
    actors: {
      layerMachine,
      layerGroupMachine,
    },
    actions: {
      // Layer management actions
      'Add new layer': assign(({ context, event, spawn, self }) => {
        assertEvent(event, 'LAYER.ADD');
        const { layerConfig, index, visible, position } = event;
        const { childLayerOrder, allowNestedGroupLayers } = context;

        if (
          layerConfig.layerType === 'layerGroup' &&
          layerConfig.parentId &&
          !allowNestedGroupLayers
        ) {
          console.warn('Nested group layers are not allowed.');
          return {};
        }

        if (context.layers.some((layer) => layer.layerActor.id === layerConfig.layerId)) {
          console.warn(`Layer with ID ${layerConfig.layerId} already exists. Layer not added.`);
          return {};
        }

        const parentRef = layerConfig.parentId
          ? findParentLayerGroupActor(context.layers, layerConfig.parentId)
          : null;

        if (layerConfig.parentId && !parentRef) {
          console.warn('Unable to find valid parent layer. Layer not added.');
          return {};
        }

        let newManagedLayer: ManagedItem<T>;
        if (layerConfig.layerType === 'layerGroup') {
          const newLayer = spawn('layerGroupMachine', {
            id: layerConfig.layerId,
            input: {
              layerManagerRef: self,
              parentRef,
              ...layerConfig,
            },
          });
          newManagedLayer = {
            type: 'layerGroup',
            layerData: layerConfig.layerData,
            layerActor: newLayer,
          };
        } else {
          const newLayer = spawn('layerMachine', {
            id: layerConfig.layerId,
            input: {
              layerManagerRef: self,
              parentRef,
              ...layerConfig,
            },
          });
          newManagedLayer = {
            type: 'layer',
            layerData: layerConfig.layerData,
            layerActor: newLayer,
          };
        }

        if (visible === true) {
          newManagedLayer.layerActor.send({ type: 'LAYER.ENABLED' });
        }

        return parentRef
          ? addLayerToParent(context.layers, newManagedLayer, parentRef, index, position)
          : addLayerToTopLevel(context.layers, newManagedLayer, childLayerOrder, index, position);
      }),
      'Remove layer': assign(({ context, event }) => {
        assertEvent(event, 'LAYER.REMOVE');
        const { layerId } = event;

        const layerToRemove = context.layers.find((layer) => layer.layerActor.id === layerId);

        if (!layerToRemove) {
          console.warn('Unable to find layer to remove.');
          return {};
        }

        const { parentRef, layerType } = layerToRemove.layerActor.getSnapshot().context;
        if (layerType === 'layerGroup') {
          const { children } = layerToRemove.layerActor.getSnapshot().context as LayerGroupContext;
          if (children.length > 0) {
            console.warn('Layer group has children. Not removed.');
            return {};
          }
        }
        if (parentRef) {
          parentRef.send({ type: 'LAYERS.REMOVE_CHILD', id: layerId });
        }

        stopChild(layerId);

        return {
          layers: context.layers.filter((layer) => layer.layerActor.id !== layerId),
          childLayerOrder: context.childLayerOrder.filter((id) => id !== layerId),
        };
      }),
      'Update layer order': (_, params: { layerOrder: string[] }) => {
        console.log('Updated layer order', params);
        console.warn('Update layer order not implemented');
      },
      'Raise layer order changed': raise({ type: 'LAYER.REORDER' }),

      // Layer property update actions
      'Update layer visibility': (_, params: { layerId: string; visible: boolean }) => {
        console.log('Update layer visibility', params);
        console.warn('Update Layer Visibility not implemented');
      },
      'Update layer opacity': (_, params: { layerId: string; opacity: number }) => {
        console.log('Update layer opacity', params);
        console.warn('Update layer opacity not implemented');
      },
      'Update layer time info': (_, params: { layerId: string; timeInfo: LayerTimeInfo }) => {
        console.log('Update layer time info', params);
        console.warn('Update layer time info not implemented');
      },

      // Reset actions
      'Reset layer manager': assign(({ context }) => {
        // stop all spawned actors:
        context.layers.forEach((layer) => {
          stopChild(layer.layerActor.id);
        });

        return {
          layers: [],
          childLayerOrder: [],
        };
      }),
    },
  }).createMachine({
    id: 'layerManager',
    context: ({ input }) => ({
      layers: [],
      childLayerOrder: [],
      allowNestedGroupLayers: input.allowNestedGroupLayers,
    }),
    on: {
      'LAYER.UPDATE_VISIBILITY': {
        actions: {
          type: 'Update layer visibility',
          params: ({ event }) => ({
            layerId: event.layerId,
            visible: event.visible,
          }),
        },
      },
      'LAYER.REORDER': {
        actions: {
          type: 'Update layer order',
          params: ({ context }) => ({
            layerOrder: getFlatLayerOrder<T>(context.layers, context.childLayerOrder),
          }),
        },
      },
      'LAYER.UPDATE_OPACITY': {
        actions: {
          type: 'Update layer opacity',
          params: ({ event }) => ({
            layerId: event.layerId,
            opacity: event.opacity,
          }),
        },
      },
      'LAYER.UPDATE_TIME_INFO': {
        actions: {
          type: 'Update layer time info',
          params: ({ event }) => ({
            layerId: event.layerId,
            timeInfo: event.timeInfo,
          }),
        },
      },
      'LAYER.ADD': {
        actions: ['Add new layer', 'Raise layer order changed'],
      },
      'LAYER.REMOVE': {
        actions: ['Remove layer', 'Raise layer order changed'],
      },
      RESET: {
        actions: ['Reset layer manager'],
      },
    },
  });
}
