import EsriMap from '@arcgis/core/Map';
import TimeExtent from '@arcgis/core/TimeExtent';
import { createActorContext } from '@xstate/react';
import React from 'react';
import { assertEvent } from 'xstate';

import { fetchGranulesForProduct } from '@/api/api';
import { LayerDisplayMode, LayerStatus } from '@/types';
import { formatDateToYYYYMMDD } from '@/utils/dateUtils';

import { ImageryFootprintLayer } from '../Map/layers/ImageryFootprintLayer/ImageryFootprintLayerClass';
import { createImageryFootprints } from '../Map/utils';
import { createLayerManagerMachine } from './machines/layerManagerMachine';
import { isRangeTimeInfo, isSingleTimeInfo } from './machines/types';

export type LayerData = {
  mapLayer: __esri.Layer | null;
  params: { style?: string; status: LayerStatus; displayMode?: LayerDisplayMode };
} | null;

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
                  console.log(mapLayer.parent.allLayers.toArray().map((layer) => layer.title));
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
            const mapLayer = layer?.layerData?.mapLayer;
            if (mapLayer) {
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
                mapLayer.set('timeExtent', timeExtent);
              }
              if (isRangeTimeInfo(timeInfo)) {
                if (mapLayer instanceof ImageryFootprintLayer) {
                  const startDataYYMMDD = formatDateToYYYYMMDD(timeInfo.start);
                  const endDataYYMMDD = formatDateToYYYYMMDD(timeInfo.end);
                  const productId = layer.layerActor.getSnapshot().context.parentRef?.id;
                  if (productId) {
                    fetchGranulesForProduct(productId, `${startDataYYMMDD}/${endDataYYMMDD}`).then(
                      (granules) => {
                        const imageryFootprints = createImageryFootprints(granules);
                        mapLayer.imageryFootprints.splice(
                          0,
                          mapLayer.imageryFootprints.length,
                          ...imageryFootprints,
                        );
                      },
                    );
                  }
                }
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
