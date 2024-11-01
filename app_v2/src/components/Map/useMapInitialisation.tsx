import Basemap from '@arcgis/core/Basemap';
import EsriMap from '@arcgis/core/Map';
import React from 'react';

import { useProducts } from '@/api/useProducts';
import { useAddLayer } from '@/components/LayerManager/hooks/useAddLayer';
import { LayerTimeInfo } from '@/components/LayerManager/machines/types';
import { createLayer, ogcPriority } from '@/components/Map/utils';
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
        if (ogcType) {
          let timeInfo: LayerTimeInfo | undefined;

          if (!layerConfig.static) {
            if (layerConfig.render_exclusive && layerConfig.latestDate) {
              timeInfo = {
                type: 'single',
                precision: 'date',
                value: layerConfig.latestDate.toDate(),
              };
            }
          }
          const newLayer = createLayer(layerConfig, ogcType, theme.currentTheme, timeInfo);

          if (newLayer) {
            addLayer(map, {
              layerData: { mapLayer: newLayer, mapProduct: layerConfig },
              layerId: layerConfig?.code ?? '',
              layerName: layerConfig?.label ?? '',
              layerType: 'layer',
              visible: layerConfig.show_on_startup ?? false,
              parentId: null,
              timeInfo: timeInfo,
            });
          }
        }
      }

      mapRef.current = map;
      setMap(map);
    }
  }, [addLayer, data, theme]);

  return map;
}
