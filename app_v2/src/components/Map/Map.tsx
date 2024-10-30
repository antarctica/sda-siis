/* eslint-disable @pandacss/no-hardcoded-color */
import Basemap from '@arcgis/core/Basemap';
import EsriMap from '@arcgis/core/Map';
import { ArcgisPlacement } from '@arcgis/map-components-react';
import { cva } from '@styled-system/css';
import { Box, Flex } from '@styled-system/jsx';
import React from 'react';

import { useAPI } from '@/api/api';
import { ArcMapView } from '@/arcgis/ArcView/ArcMapView';
import { MAP_ID } from '@/config/constants';
import useIsMobile from '@/hooks/useIsMobile';
import { OGCType } from '@/types';

import { useAddLayer } from '../LayerManager/hooks/useAddLayer';
import { useResetLayers } from '../LayerManager/hooks/useResetLayers';
import ShipPositionMapLayer from '../ShipPositionMapLayer';
import SensorInfo from '../ShipSensorInfo';
import CursorLocationControl from './map-controls/CursorLocationControl';
import ScaleControl from './map-controls/ScaleControl';
import ZoomControl from './map-controls/ZoomControl';
import { createLayer, ogcPriority } from './utils';

const mapStyles = cva({
  base: {
    '& .esri-attribution__powered-by': {
      display: 'none !important',
    },
    '& .esri-attribution': {
      bg: 'siis_darkgreyAlpha.a12 !important',
      color: 'fg !important',
      _dark: {
        bg: 'siis_greyAlpha.a11 !important',
        color: 'fg.accent !important',
      },
    },
  },
});

export function Map() {
  const [map, setMap] = React.useState<EsriMap>();
  const addLayer = useAddLayer();
  const resetLayers = useResetLayers();
  const { data } = useAPI('/products', {
    params: {
      query: { hemi: 'S' },
    },
  });

  React.useEffect(() => {
    if (data) {
      const map = new EsriMap({
        basemap: new Basemap({
          baseLayers: [],
          spatialReference: {
            wkid: 3031,
          },
        }),
      });

      addLayer(map, {
        layerData: null,
        layerId: 'reference',
        layerName: 'Reference',
        layerType: 'layerGroup',
        parentId: null,
      });

      // get the layers that should be shown on startup, sorted by default_z descending
      const initialLayerConfig = data
        .filter((product) => product.show_on_startup)
        .sort((a, b) => (b.default_z ?? 0) - (a.default_z ?? 0));

      for (const layerConfig of initialLayerConfig) {
        const ogcType = ogcPriority(layerConfig.types as OGCType[]);
        if (ogcType) {
          const newLayer = createLayer(layerConfig, ogcType);
          if (newLayer) {
            addLayer(map, {
              layerData: newLayer,
              layerId: layerConfig?.label ?? '',
              layerName: layerConfig?.label ?? '',
              layerType: 'layer',
              parentId: 'reference',
            });
          }
        }
      }

      setMap(map);
      return () => {
        resetLayers();
      };
    }
  }, [data, addLayer, resetLayers]);

  const isMobile = useIsMobile();

  return (
    <Box w={'full'} h={'full'} position={'relative'} className={mapStyles()}>
      {map && (
        <ArcMapView
          id={MAP_ID}
          map={map}
          scale={25000000}
          constraints={{ rotationEnabled: false }}
          onArcgisViewReadyChange={(event) => {
            console.log(event.target.view);
          }}
        >
          {!isMobile && (
            <ArcgisPlacement position="bottom-right">
              <ZoomControl />
            </ArcgisPlacement>
          )}
          <ArcgisPlacement position="top-right">
            <SensorInfo />
          </ArcgisPlacement>
          <ArcgisPlacement position="bottom-left">
            <Flex direction={'column'} gap={'2'}>
              <ScaleControl />
              {!isMobile && <CursorLocationControl />}
            </Flex>
          </ArcgisPlacement>
          <ShipPositionMapLayer />
        </ArcMapView>
      )}
    </Box>
  );
}
