import Basemap from '@arcgis/core/Basemap';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import { SpatialReference } from '@arcgis/core/geometry';
import EsriMap from '@arcgis/core/Map';
import { today } from '@internationalized/date';
import React from 'react';

import { useProducts } from '@/api/useProducts';
import { FOOTPRINT_LAYER_NAME_SUFFIX } from '@/config/constants';
import { CRS_LOOKUP } from '@/config/map';
import { useMapInteractionLayers } from '@/contexts/MapInteractionLayers';
import { useAddLayer } from '@/features/layersManagement/components/LayerManager/hooks/useAddLayer';
import { LayerTimeInfo } from '@/features/layersManagement/components/LayerManager/machines/types';
import {
  createImageryFootprintLayer,
  createOGCLayer,
  getLayerDisplayMode,
  ogcPriority,
} from '@/features/siisMap/utils';
import { useFormatDate } from '@/hooks/useFormatDate';
import { MapCRS, OGCType } from '@/types';
import { safeParseUTC } from '@/utils/dateUtils';

import { useTheme } from '../../components/Theme';
import { useRemoveLayer } from '../layersManagement/components/LayerManager/hooks/useRemoveLayer';

export function useMapInitialization(crs: MapCRS) {
  const [map, setMap] = React.useState<EsriMap>();
  const mapRef = React.useRef<EsriMap>();
  const interactionLayers = useMapInteractionLayers();
  const dateFormatter = useFormatDate({
    dateStyle: 'medium',
    timeStyle: 'long',
    timeZone: 'UTC',
  });

  const theme = useTheme();

  const addLayer = useAddLayer();
  const removeLayer = useRemoveLayer();

  const { data } = useProducts(crs);
  React.useEffect(() => {
    if (mapRef.current) {
      // map already initialized
      return;
    }

    if (data) {
      const map = new EsriMap({
        basemap: new Basemap({
          baseLayers: [],
          spatialReference: new SpatialReference({
            wkid: CRS_LOOKUP[crs].wkid,
          }),
        }),
      });

      Object.values(interactionLayers).forEach((layer) => {
        if (layer.alwaysVisible) {
          map.add(layer.layer);
        }
      });

      const { products } = data;

      // get the layers that should be shown on startup, sorted by default_z descending
      const initialLayerConfig = products.sort((a, b) => (b.default_z ?? 0) - (a.default_z ?? 0));

      for (const layerConfig of initialLayerConfig) {
        const ogcType = ogcPriority(layerConfig.types as OGCType[]);
        const { code: layerId } = layerConfig;
        if (!ogcType || !layerId) continue;
        const displayMode = getLayerDisplayMode(layerConfig);
        switch (displayMode) {
          case 'Static':
            const newLayer = createOGCLayer(
              layerConfig,
              CRS_LOOKUP[crs].wkid,
              ogcType,
              theme.currentTheme,
              layerConfig.show_on_startup ?? false,
            );

            addLayer(map, {
              layerData: {
                mapLayer: newLayer,
                params: {
                  style: layerConfig.style,
                  status: 'static',
                  displayMode: 'Static',
                },
              },
              layerId,
              layerName: layerConfig?.label ?? '',
              layerType: 'layer',
              visible: layerConfig.show_on_startup ?? false,
              parentId: null,
            });

            break;
          case 'SingleTimeSlice':
            if (layerConfig.latestDate && layerConfig.render_exclusive) {
              const timeInfo: LayerTimeInfo = {
                type: 'single',
                precision: 'date',
                value: layerConfig.latestDate.toDate(),
              };
              const newLayer = createOGCLayer(
                layerConfig,
                CRS_LOOKUP[crs].wkid,
                ogcType,
                theme.currentTheme,
                layerConfig.show_on_startup ?? false,
                timeInfo,
              );

              addLayer(map, {
                layerData: {
                  mapLayer: newLayer,
                  params: {
                    style: layerConfig.style,
                    status: layerConfig.status,
                    displayMode: 'SingleTimeSlice',
                  },
                },
                layerId,
                layerName: layerConfig?.label ?? '',
                layerType: 'layer',
                visible: layerConfig.show_on_startup ?? false,
                parentId: null,
                timeInfo,
              });
            }
            break;
          case 'MultipleTimeSliceCollection':
            const timeInfo: LayerTimeInfo = {
              type: 'range',
              precision: 'date',
              start: today('UTC')
                .subtract({ days: Math.ceil((layerConfig.default_timeframe ?? 0) / 24) })
                .toDate('UTC'),
              end: today('UTC').toDate('UTC'),
            };
            addLayer(map, {
              layerData: {
                mapLayer: null,
                params: {
                  style: layerConfig.style,
                  status: layerConfig.status,
                  displayMode: 'MultipleTimeSliceCollection',
                },
              },
              layerId,
              layerName: layerConfig?.label ?? '',
              layerType: 'layerGroup',
              visible: layerConfig.show_on_startup ?? false,
              parentId: null,
            });

            const footprintLayer = createImageryFootprintLayer(
              layerConfig,
              layerConfig.granules,
              layerConfig.show_on_startup ?? false,
              layerConfig.granule_footprint_color ?? '#000000',
            );
            addLayer(map, {
              layerData: {
                mapLayer: footprintLayer,
                params: {
                  style: layerConfig.style,
                  status: layerConfig.status,
                },
              },
              layerId: `${layerId}-${FOOTPRINT_LAYER_NAME_SUFFIX}`,
              layerName: `${layerConfig?.label} Footprints`,
              layerType: 'layer',
              visible: layerConfig.show_on_startup ?? false,
              parentId: layerId,
              timeInfo,
            });

            reactiveUtils.on(
              () => footprintLayer.subLayers,
              'after-add',
              (event) => {
                const { layer, timestamp, id } = event.item as {
                  layer: __esri.Layer;
                  id: string;
                  timestamp: string;
                };

                const utcDate = safeParseUTC(timestamp);
                if (!utcDate) return;
                const layerName = dateFormatter.format(utcDate.toDate());

                addLayer(map, {
                  layerData: {
                    mapLayer: layer,
                    params: {
                      style: layerConfig.style,
                      status: layerConfig.status,
                      iwsViewTemplate: layerConfig.iws_viewer_template,
                    },
                  },
                  layerId: id,
                  layerName,
                  layerType: 'layer',
                  visible: true,
                  parentId: layerId,
                  position: 'top',
                });
              },
            );

            reactiveUtils.on(
              () => footprintLayer.subLayers,
              'after-remove',
              (event) => {
                const { id } = event.item as {
                  id: string;
                };
                removeLayer(map, id);
              },
            );
            break;
        }
      }

      mapRef.current = map;
      setMap(map);
    }
  }, [addLayer, data, theme, dateFormatter, crs, interactionLayers, removeLayer]);

  return map;
}
