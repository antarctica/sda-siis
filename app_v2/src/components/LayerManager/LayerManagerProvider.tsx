import EsriMap from '@arcgis/core/Map';
import TimeExtent from '@arcgis/core/TimeExtent';
import { createActorContext } from '@xstate/react';
import React from 'react';
import { assertEvent } from 'xstate';

import { MapProduct } from '@/types';

import { createLayerManagerMachine } from './machines/layerManagerMachine';
import { isSingleTimeInfo } from './machines/types';

export type LayerData = { mapLayer: __esri.Layer | null; mapProduct: MapProduct } | null;

export const LayerManagerContext = createActorContext(createLayerManagerMachine<LayerData>());

export const LayerManagerProvider = React.memo(({ children }: { children: React.ReactNode }) => {
  const layerManagerMachine = React.useMemo(
    () =>
      createLayerManagerMachine<LayerData>().provide({
        actions: {
          'Update layer visibility': ({ event, context }) => {
            assertEvent(event, 'LAYER.UPDATE_VISIBILITY');
            const { layerId, visible } = event;
            const { layers } = context;
            const layer = layers.find((layer) => layer.layerActor.id === layerId);
            if (layer && layer.layerData?.mapLayer) {
              layer.layerData.mapLayer.set('visible', visible);
            }
          },
          'Update layer opacity': ({ event, context }) => {
            assertEvent(event, 'LAYER.UPDATE_OPACITY');
            const { layerId, opacity } = event;
            const { layers } = context;
            const layer = layers.find((layer) => layer.layerActor.id === layerId);
            if (layer && layer.layerData?.mapLayer) {
              layer.layerData.mapLayer.set('opacity', opacity);
            }
          },

          'Update layer order': ({ context }, params: { layerOrder: string[] }) => {
            const { layerOrder } = params;
            const mapLayerOrder = layerOrder.filter((layerId) => {
              const layer = context.layers.find((layer) => layer.layerActor.id === layerId);
              return !!layer?.layerData;
            });

            for (const [index, layerId] of mapLayerOrder.entries()) {
              const layer = context.layers.find((layer) => layer.layerActor.id === layerId);
              if (layer && layer.layerData?.mapLayer) {
                const { mapLayer } = layer.layerData;
                if (mapLayer.parent instanceof EsriMap) {
                  console.log('reordering', mapLayer, index);
                  const parent = mapLayer.parent as __esri.Map;
                  parent.reorder(mapLayer, index);
                  console.log(parent.allLayers.toArray().map((layer) => layer.title));
                }
              }
            }
          },
          'Update layer time info': ({ event, context }) => {
            assertEvent(event, 'LAYER.UPDATE_TIME_INFO');
            const { layerId, timeInfo } = event;
            const layer = context.layers.find((layer) => layer.layerActor.id === layerId);
            if (layer && layer.layerData?.mapLayer) {
              if (isSingleTimeInfo(timeInfo)) {
                // generate a range over the entire day of the timeInfo.value
                const start = new Date(timeInfo.value);
                start.setHours(0, 0, 0, 0);
                const end = new Date(timeInfo.value);
                end.setHours(23, 59, 59, 999);
                const timeExtent = new TimeExtent({
                  start,
                  end,
                });
                layer.layerData.mapLayer.set('timeExtent', timeExtent);
              }
            }
          },
        },
      }),
    [],
  );
  return (
    <LayerManagerContext.Provider
      logic={layerManagerMachine}
      options={{
        input: {
          allowNestedGroupLayers: false,
        },
      }}
    >
      {children}
    </LayerManagerContext.Provider>
  );
});
