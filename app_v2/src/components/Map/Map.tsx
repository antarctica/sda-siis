/* eslint-disable @pandacss/no-hardcoded-color */
import { ArcgisPlacement } from '@arcgis/map-components-react';
import { cva } from '@styled-system/css';
import { Box, Flex } from '@styled-system/jsx';
import React from 'react';

import { ArcMapView } from '@/arcgis/ArcView/ArcMapView';
import { getMap } from '@/config/map';
import useIsMobile from '@/hooks/useIsMobile';

import { SensorInfo } from '../ShipSensorInfo';
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
  const { map, initialZoom } = React.useMemo(() => {
    return getMap();
  }, []);

  const isMobile = useIsMobile();

  return (
    <Box w={'full'} h={'full'} position={'relative'} className={mapStyles()}>
      <ArcMapView id="map" map={map} zoom={initialZoom}>
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
      </ArcMapView>
    </Box>
  );
}
