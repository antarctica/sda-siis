/* eslint-disable @pandacss/no-hardcoded-color */
import Basemap from '@arcgis/core/Basemap';
import Layer from '@arcgis/core/layers/Layer';
import WMTSLayer from '@arcgis/core/layers/WMTSLayer';
import EsriMap from '@arcgis/core/Map';
import { ArcgisPlacement } from '@arcgis/map-components-react';
import { cva } from '@styled-system/css';
import { Box, Flex } from '@styled-system/jsx';
import React from 'react';

import { useAPI } from '@/api/api';
import { ArcMapView } from '@/arcgis/ArcView/ArcMapView';
import useIsMobile from '@/hooks/useIsMobile';

import { useAddLayer } from '../LayerManager/hooks/useAddLayer';
import { useResetLayers } from '../LayerManager/hooks/useResetLayers';
import ShipPositionMapLayer from '../ShipPositionMapLayer';
import SensorInfo from '../ShipSensorInfo';
import CursorLocationControl from './map-controls/CursorLocationControl';
import ScaleControl from './map-controls/ScaleControl';
import ZoomControl from './map-controls/ZoomControl';

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
      const initialLayers = data.filter((product) => product.show_on_startup);
      // const wmsLayers = initialLayers.filter(
      //   (product) => product.types && product.types.includes('WMS'),
      // );
      const wmtsLayers = initialLayers
        .filter((product) => product.types && product.types.includes('WMTS'))
        .reverse();

      const layers: Layer[] = [];
      for (const layer of wmtsLayers) {
        const wmtsLayer = new WMTSLayer({
          url: `${import.meta.env.VITE_SERVICE_API_OGC_ENDPOINT}/${layer.gs_wmtsendpoint}`,
          activeLayer: {
            id: layer.gs_layername,
            styleId: `${layer.style}.${'night'}`,
          },
          title: layer.label,
          copyright: layer.attribution,
        });

        layers.push(wmtsLayer);
      }

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

      for (const layer of layers) {
        addLayer(map, {
          layerData: layer,
          layerId: layer.id,
          layerName: layer.title,
          layerType: 'layer',
          parentId: 'reference',
          opacity: 1,
        });
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
          id="map"
          map={map}
          scale={100000000}
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
