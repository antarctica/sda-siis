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
  /** @xstate-layout N4IgpgJg5mDOIC5QBsCGBPMAnAxAGQEEBNAUQCUA6AZRIBUB9AeQAUCBhASVqIG0AGALqJQABwD2sAJYAXSWIB2wkAA9EATgAcGigEY+AVn1qdAFgBMANgDs+nToA0IdIg0XdOs5YDMZvl+sm-gC+QY5omLiEpJQ0DLQcALIk9BwAcgBijPxCSCDiUrIKSqoIFn4UFhqW+nxWOvpWVmr6js4Iru6eJiZ8apWB+iYhYRjYFGDyqABGyJD4xOQUACIcVAQAQngkS9lK+TJyirklFvUUZvpermaaJoaurYgmfRXXanWGmhfDIOFjE9NZhAKAA3SRSGZgHCsMgkVK0CgACQ4SyWcN2uX2hSOoBKOi8aj4FEMFjUBPMXhMVi8LSciAsJjcajMGlsl0ZRhMGh+fyw40mkOBAAtJBAIBNoQRYfCKAA1VYcTYkDGiCQHIrHRD44wUQmU-x8AxmGwWR4IfQWfS6a42Dw6KyWtQ80Z8iDgwFzKKLOEbLY7QR7NXY4r0s4XK4WG4aO76B5082s873TS9LTdMwhUIgeRicXwXK8wMFQ4hhAAWh0ajNZipxOMah6fAslT4piGWd5-I9ECL6pxKhcsYotT6ZNMXnqdzNXiadcrjebGlb3WdES7gtB4MkkN7wc1CEJbhHpIngUntLath0c+ZXL4S487ZGa4BG5FYomu5L+50DLMFA0RoqWjDRKx0aMzUMK1LG6ZobDMGcNCdDsXQoN1YG7L8NVxRAbjNExwPOBkqVMDQfDsLxVzGdDuwod9xX7LFvxwhBGkgmoiNghp9AQqwkMzIIgA */
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
