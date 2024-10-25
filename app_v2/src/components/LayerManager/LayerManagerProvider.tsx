import { createActorContext } from '@xstate/react';

import { createLayerManagerMachine } from './machines/layerManagerMachine';

export const LayerManagerContext = createActorContext(
  createLayerManagerMachine<{
    id: string;
  }>(),
);

export function LayerManagerProvider({ children }: { children: React.ReactNode }) {
  return (
    <LayerManagerContext.Provider
      options={{
        input: {
          allowNestedGroupLayers: false,
        },
      }}
    >
      {children}
    </LayerManagerContext.Provider>
  );
}
