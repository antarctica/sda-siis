import { ActorRef, ActorRefFrom, Snapshot } from 'xstate';

import { layerGroupMachine } from './layers/layerGroupMachine';
import { layerMachine } from './layers/layerMachine';

// Base types
export type LayerType = 'layer' | 'layerGroup';

export interface BaseLayerConfig<T> {
  layerId: string;
  layerName: string;
  parentId: string | null;
  layerData: T;
}

export interface LayerConfig<T> extends BaseLayerConfig<T> {
  layerType: 'layer';
  opacity?: number;
  timeInfo?: LayerTimeInfo;
}

export interface LayerGroupConfig<T> extends BaseLayerConfig<T> {
  layerType: 'layerGroup';
  listMode?: 'show' | 'hide' | 'hide-children';
}

// Time-related types
export type LayerTimeInfo = {
  type: 'single' | 'range';
  precision: 'date' | 'datetime';
} & (
  | {
      type: 'single';
      value: Date;
    }
  | {
      type: 'range';
      start: Date;
      end: Date;
    }
);

// Context types
export interface LayerContextBase {
  layerManagerRef: LayerManager;
  parentRef: ParentLayerActor | null;
  layerId: string;
  layerName: string;
  layerType: LayerType;
}

export interface LayerContext extends LayerContextBase {
  layerType: 'layer';
  listMode: 'show' | 'hide';
  timeInfo?: LayerTimeInfo;
  opacity: number;
}

export interface LayerGroupContext extends LayerContextBase {
  layerType: 'layerGroup';
  children: ChildLayerActor[];
  childLayerOrder: string[];
  listMode: 'show' | 'hide' | 'hide-children';
}

// Event types
export type LayerManagerEvent<T> =
  | { type: 'LAYER.UPDATE_VISIBILITY'; layerId: string; visible: boolean }
  | {
      type: 'LAYER.ADD';
      layerConfig: LayerConfig<T> | LayerGroupConfig<T>;
      visible?: boolean;
      index?: number;
      position?: 'top' | 'bottom';
    }
  | { type: 'LAYER.REMOVE'; layerId: string }
  | { type: 'LAYER.REORDER' }
  | { type: 'LAYER.UPDATE_OPACITY'; layerId: string; opacity: number }
  | { type: 'LAYER.UPDATE_TIME_INFO'; layerId: string; timeInfo: LayerTimeInfo }
  | { type: 'RESET' };

export type ParentEvent =
  | { type: 'CHILD.VISIBLE'; layerId: string }
  | {
      type: 'LAYERS.ADD_CHILD';
      child: ChildLayerActor;
      index?: number;
      position?: 'top' | 'bottom';
    }
  | { type: 'LAYERS.REMOVE_CHILD'; id: string };

export type ChildEvent =
  | { type: 'LAYER.ENABLED' }
  | { type: 'LAYER.DISABLED' }
  | { type: 'PARENT.VISIBLE' }
  | { type: 'PARENT.HIDDEN' };

// Actor types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LayerManager = ActorRef<Snapshot<unknown>, LayerManagerEvent<any>>;
export type ParentLayerActor = ActorRef<Snapshot<unknown>, ParentEvent>;
export type ChildLayerActor = ActorRef<Snapshot<unknown>, ChildEvent>;
export type LayerMachineActor = ActorRefFrom<typeof layerMachine>;
export type LayerGroupMachineActor = ActorRefFrom<typeof layerGroupMachine>;
export type LayerActor = LayerMachineActor | LayerGroupMachineActor;

// Utility types
export type ManagedLayer<T> = {
  type: 'layer';
  layerData: T;
  layerActor: LayerMachineActor;
};

export type ManagedLayerGroup<T> = {
  type: 'layerGroup';
  layerData: T;
  layerActor: LayerGroupMachineActor;
};

export type ManagedItem<T> = ManagedLayer<T> | ManagedLayerGroup<T>;

// Type guards
export function isLayerMachine(layer: LayerActor): layer is LayerMachineActor {
  return layer.getSnapshot().context.layerType === 'layer';
}

export function isLayerGroupMachine(layer: LayerActor): layer is LayerGroupMachineActor {
  return layer.getSnapshot().context.layerType === 'layerGroup';
}
