import { createActorContext } from '@xstate/react';
import { assertEvent } from 'xstate';

import { createLayerManagerMachine } from './machines/layerManagerMachine';

export type LayerData = __esri.Layer | null;

export const LayerManagerContext = createActorContext(createLayerManagerMachine<LayerData>());

export function LayerManagerProvider({ children }: { children: React.ReactNode }) {
  return (
    <LayerManagerContext.Provider
      logic={createLayerManagerMachine<LayerData>().provide({
        actions: {
          'Update layer visibility': ({ event, context }) => {
            assertEvent(event, 'LAYER.UPDATE_VISIBILITY');
            const { layerId, visible } = event;
            const { layers } = context;
            const layer = layers.find((layer) => layer.layerActor.id === layerId);
            if (layer && layer.layerData) {
              layer.layerData.set('visible', visible);
            }
          },
          'Update layer opacity': ({ event, context }) => {
            assertEvent(event, 'LAYER.UPDATE_OPACITY');
            const { layerId, opacity } = event;
            const { layers } = context;
            const layer = layers.find((layer) => layer.layerActor.id === layerId);
            if (layer && layer.layerData) {
              layer.layerData.set('opacity', opacity);
            }
          },
        },
      })}
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
