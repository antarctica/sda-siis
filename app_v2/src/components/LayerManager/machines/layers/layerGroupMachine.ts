import { assign, setup } from 'xstate';

import {
  ChildEvent,
  ChildLayerActor,
  LayerGroupContext,
  LayerManager,
  ParentEvent,
  ParentLayerActor,
} from '../types';
import { isValidLayerIndex } from '../utils';

type LayerGroupEvent = ChildEvent | ParentEvent;

export const layerGroupMachine = setup({
  types: {
    context: {} as LayerGroupContext,
    events: {} as LayerGroupEvent,
    input: {} as {
      layerId: string;
      parentRef: ParentLayerActor | null;
      layerName: string;
      layerManagerRef: LayerManager;
      listMode?: 'show' | 'hide' | 'hide-children';
    },
  },
  actions: {
    'Notify children of visibility change': (
      _,
      params: { children: ChildLayerActor[]; visible: boolean },
    ) => {
      params.children.forEach((child) => {
        child.send({ type: params.visible ? 'PARENT.VISIBLE' : 'PARENT.HIDDEN' });
      });
    },
    'Notify Parents of visibility change': (
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
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QBsCGBPMAnA4lg9gK4AOAxAMIASAkgDIAiAdAGrUDK1AQrQKIDaABgC6iUMXywAlgBdJ+AHaiQAD0QBOABwAmRmoCMAgCwa1mjQGYArAHYNAGhDp1jPRu221WgVssDLPgF8AhzRMXAISUloAQQBNHgAlNkZo+noAfSo6ekERJBBxKVkFJVUEa3M1XT0tDWtrY0tDNUMANgcnBCrXd1a9c2tLDT1LNVagkIxsPCIyGPikxgSeAFkAeWYeTJoGXKVCmTlFfLLDY0YK2wFXATcbGw7EEZdzZp99Hz0R14mQUOmIsRGGB5KgAEbISBROKJRj0djRbg8HLCfYSQ4lE6ILT9Ri3NRWNr9ATmcytcyPBADVqMJpfDSteqGLTWPSDX7-cKzYGgiGQRgAN0kUj5pAACtFlgA5AAqjBoaR4Ur2+QOxWOoDK9R01wMagalkqX2slN8hgu+j05Is5NG1g5Uy5JB54MhEEYAAtJBAICDxZKlXLWBwkSqxOj1aVENrdMZWk0NIZrK0tJ5KWcBBavpZGbc9IYbONgn9HTNnRBha6ofNYUrEbwUXlw0UjlGEDjzHiTIS+uYSWSKY5EEnrLTDDU-EMNL5GQ6wmWgRXYFWIBQdkxg1xeGGChHW1j27j8T3iaTyemWXjx3oxq5+t2gsX5PhffB8pyF2iW5jNYgALQ4ro8bmDU5g2imYxaJSXydkYxr9jmwF6HOALciCK5fhiGoqIgYHmrUBbDGy1g+EMlJaK05p0myWikomRhWChTpAuhfLukKIqQphkYHoY5g6ARQzGiRlhkUOVJjGO2bMhYzR+ExC4umxnrer62Fqvuv5dKJjAEa0AgGQYWiGCS6bNIwAwFgY46mDihgKYCjBLhhqp7j+OHtjSJJtHUfTkgMJL2OJpJ6Iw44pgI+pybUWgOdyznKV6PogtxmkeQ0eKvK0vlWqS1hGOm5JhVaN5Wi0Xx8eYj4BEAA */
  id: 'layerGroup',
  description: 'A machine that represents a collection of layers that can be toggled as a group',
  initial: 'disabled',
  context: ({ input }) => ({
    layerManagerRef: input.layerManagerRef,
    layerId: input.layerId,
    parentRef: input.parentRef,
    children: [],
    childLayerOrder: [],
    layerName: input.layerName,
    layerType: 'layerGroup',
    listMode: input.listMode ?? 'show',
  }),
  states: {
    enabled: {
      initial: 'visible',
      description: 'The layer group is enabled',
      states: {
        visible: {
          description: 'The layer group should appear visible on the map',
          entry: [
            {
              type: 'Notify Parents of visibility change',
              params: ({ context }) => ({
                parentRef: context.parentRef,
                children: context.children,
                layerId: context.layerId,
              }),
            },
            {
              type: 'Notify children of visibility change',
              params: ({ context }) => ({
                children: context.children,
                visible: true,
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
            {
              type: 'Notify children of visibility change',
              params: ({ context }) => ({
                children: context.children,
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
          description: 'The layer group should appear hidden on the map as its parent is hidden',
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
      description: 'The layer group is disabled',
      initial: 'hidden',
      states: {
        hidden: {},
      },
      on: {
        'LAYER.ENABLED': {
          target: 'enabled',
        },
        'CHILD.VISIBLE': {
          target: 'enabled',
        },
      },
    },
  },
  on: {
    'CHILD.VISIBLE': {
      actions: [
        {
          type: 'Notify Parents of visibility change',
          params: ({ context }) => ({
            parentRef: context.parentRef,
            layerId: context.layerId,
          }),
        },
      ],
    },
    'LAYERS.ADD_CHILD': {
      actions: [
        assign(({ context, event }) => {
          const { childLayerOrder, children } = context;
          const { index, child } = event;

          let newChildLayerOrder = [...childLayerOrder];

          if (index && isValidLayerIndex(index, childLayerOrder.length)) {
            newChildLayerOrder.splice(index, 0, child.id);
          } else {
            newChildLayerOrder = [child.id, ...newChildLayerOrder];
          }

          return {
            children: [...children, child],
            childLayerOrder: newChildLayerOrder,
          };
        }),
      ],
    },

    'LAYERS.REMOVE_CHILD': {
      actions: [
        assign({
          children: ({ context, event }) => {
            return context.children.filter((layer) => layer.id !== event.id);
          },
          childLayerOrder: ({ context, event }) => {
            return context.childLayerOrder.filter((layerId) => layerId !== event.id);
          },
        }),
      ],
    },
  },
});
