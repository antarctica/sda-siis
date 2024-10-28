import { assertEvent, enqueueActions, setup } from 'xstate';

import { ChildEvent, LayerContext, LayerManager, LayerTimeInfo, ParentLayerActor } from '../types';

export type LayerEvent =
  | ChildEvent
  | {
      type: 'LAYER.SET_OPACITY';
      opacity: number;
    }
  | { type: 'LAYER.SET_TIME_INFO'; timeInfo: LayerTimeInfo };

export const layerMachine = setup({
  types: {
    context: {} as LayerContext,
    events: {} as LayerEvent,
    input: {} as {
      layerManagerRef: LayerManager;
      layerId: string;
      parentRef: ParentLayerActor | null;
      layerName: string;
      listMode?: 'show' | 'hide';
      opacity?: number;
      timeInfo?: LayerTimeInfo;
    },
  },
  actions: {
    'Notify Parent that layer is visible': (
      _,
      params: { parentRef: ParentLayerActor | null; layerId: string },
    ) => {
      if (params.parentRef) {
        params.parentRef.send({ type: 'CHILD.VISIBLE', layerId: params.layerId });
      }
    },
    'Notify Manager of visibility change': (
      _,
      params: { layerManagerRef: LayerManager; layerId: string; visible: boolean },
    ) => {
      params.layerManagerRef.send({
        type: 'LAYER.UPDATE_VISIBILITY',
        layerId: params.layerId,
        visible: params.visible,
      });
    },
    'Change Layer Opacity': enqueueActions(({ event, context, enqueue }) => {
      console.log('Change Layer Opacity', event);
      assertEvent(event, 'LAYER.SET_OPACITY');
      enqueue(() =>
        context.layerManagerRef.send({
          type: 'LAYER.UPDATE_OPACITY',
          layerId: context.layerId,
          opacity: event.opacity,
        }),
      );
      enqueue.assign({
        opacity: context.opacity,
      });
    }),
    'Change Layer Time Info': enqueueActions(({ event, context, enqueue }) => {
      assertEvent(event, 'LAYER.SET_TIME_INFO');
      enqueue(() =>
        context.layerManagerRef.send({
          type: 'LAYER.UPDATE_TIME_INFO',
          layerId: context.layerId,
          timeInfo: event.timeInfo,
        }),
      );
      enqueue.assign({
        timeInfo: event.timeInfo,
      });
    }),
  },
}).createMachine({
  id: 'layer',
  description: 'A machine that represents a layer on the map.',
  context: ({ input }) => ({
    layerManagerRef: input.layerManagerRef,
    parentRef: input.parentRef,
    layerId: input.layerId,
    layerName: input.layerName,
    listMode: input.listMode ?? 'show',
    opacity: input.opacity ?? 1,
    layerType: 'layer',
    timeInfo: input.timeInfo,
  }),
  initial: 'disabled',
  states: {
    enabled: {
      initial: 'visible',
      description: 'The layer is enabled',
      states: {
        visible: {
          description: 'The layer should appear visible on the map',
          entry: [
            {
              type: 'Notify Parent that layer is visible',
              params: ({ context }) => ({
                parentRef: context.parentRef,
                layerId: context.layerId,
              }),
            },
            {
              type: 'Notify Manager of visibility change',
              params: ({ context }) => ({
                layerManagerRef: context.layerManagerRef,
                layerId: context.layerId,
                visible: true,
              }),
            },
          ],
          exit: [
            {
              type: 'Notify Manager of visibility change',
              params: ({ context }) => ({
                layerManagerRef: context.layerManagerRef,
                layerId: context.layerId,
                visible: false,
              }),
            },
          ],

          on: {
            'PARENT.HIDDEN': {
              target: 'hidden',
            },
          },
        },
        hidden: {
          description: 'The layer should appear hidden on the map as its parent is hidden',
          on: {
            'PARENT.VISIBLE': {
              target: 'visible',
            },
          },
        },
      },
      on: {
        'LAYER.DISABLED': {
          target: 'disabled',
        },
      },
    },
    disabled: {
      description: 'The layer is disabled',
      initial: 'hidden',
      states: {
        hidden: {
          description: 'The layer should always appear hidden on the map',
        },
      },
      on: {
        'LAYER.ENABLED': {
          target: 'enabled',
        },
      },
    },
  },
  on: {
    'LAYER.SET_OPACITY': {
      actions: 'Change Layer Opacity',
    },
    'LAYER.SET_TIME_INFO': {
      actions: 'Change Layer Time Info',
    },
  },
});
