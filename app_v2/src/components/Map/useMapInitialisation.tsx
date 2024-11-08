import Basemap from '@arcgis/core/Basemap';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import EsriMap from '@arcgis/core/Map';
import React from 'react';

import { useProducts } from '@/api/useProducts';
import { useAddLayer } from '@/components/LayerManager/hooks/useAddLayer';
import { LayerTimeInfo } from '@/components/LayerManager/machines/types';
import {
  createImageryFootprintLayer,
  createOGCLayer,
  getLayerDisplayMode,
  ogcPriority,
} from '@/components/Map/utils';
import { OGCType } from '@/types';

import { useTheme } from '../Theme';

export function useMapInitialization() {
  const [map, setMap] = React.useState<EsriMap>();
  const mapRef = React.useRef<EsriMap>();

  const theme = useTheme();

  const addLayer = useAddLayer();

  const { data } = useProducts();
  React.useEffect(() => {
    if (mapRef.current) {
      // map already initialized
      return;
    }

    if (data) {
      const map = new EsriMap({
        basemap: new Basemap({
          baseLayers: [],
          spatialReference: {
            wkid: 3031,
          },
        }),
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
            );
            addLayer(map, {
              layerData: {
                mapLayer: footprintLayer,
                params: {
                  style: layerConfig.style,
                  status: layerConfig.status,
                },
              },
              layerId: `${layerId}-footprint`,
              layerName: `Footprints`,
              layerType: 'layer',
              visible: true,
              parentId: layerId,
            });

            reactiveUtils.on(
              () => footprintLayer.subLayers,
              'after-add',
              (event) => {
                const { layer } = event.item as { layer: __esri.Layer; id: string };
                addLayer(map, {
                  layerData: {
                    mapLayer: layer,
                    params: {
                      style: layerConfig.style,
                      status: layerConfig.status,
                    },
                  },
                  layerId: `${layerId}-${layer.title}`,
                  layerName: layer.title,
                  layerType: 'layer',
                  visible: true,
                  parentId: layerId,
                });
              },
            );
            break;
        }
      }

      mapRef.current = map;
      setMap(map);
    }
  }, [addLayer, data, theme]);

  return map;
}
