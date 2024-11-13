/* eslint-disable @pandacss/no-hardcoded-color */
import { ArcgisPlacement } from '@arcgis/map-components-react';
import { cva } from '@styled-system/css';
import { Box, Flex } from '@styled-system/jsx';
import React from 'react';

import { ArcMapView } from '@/arcgis/ArcView/ArcMapView';
import { CRS_TO_HEMISPHERE, MAP_ID } from '@/config/constants';
import useIsMobile from '@/hooks/useIsMobile';
import { MapCRS } from '@/types';

import SensorInfo from '../ShipSensorInfo';
import LabelledGraticuleLayer from './layers/GraticuleLayer/LabelledGraticuleLayer';
import ShipPositionLayer from './layers/ShipPositionLayer';
import CursorLocationControl from './map-controls/CursorLocationControl';
import MapRotationControl from './map-controls/MapRotationControl';
import ScaleControl from './map-controls/ScaleControl';
import ZoomControl from './map-controls/ZoomControl';
import { SynchroniseLayerTheme } from './synchronisation/SynchroniseLayerTheme';
import { useMapInitialization } from './useMapInitialisation';

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

export function Map({ crs }: { crs: MapCRS }) {
  const map = useMapInitialization(crs);
  const isMobile = useIsMobile();
  const center = React.useMemo(() => {
    switch (crs) {
      case MapCRS.ANTARCTIC:
        return [0, -90];
      case MapCRS.ARCTIC:
        return [0, 90];
      default:
        return [0, 0];
    }
  }, [crs]);

  return (
    <Box w={'full'} h={'full'} position={'relative'} className={mapStyles()}>
      {map && (
        <ArcMapView
          id={MAP_ID}
          map={map}
          scale={25000000}
          constraints={{ rotationEnabled: false, minScale: 50e6, maxScale: 10e3 }}
          onArcgisViewReadyChange={(event) => {
            console.log(event.target.view);
          }}
          center={center}
        >
          {!isMobile && (
            <ArcgisPlacement position="bottom-right">
              <Flex direction={'column'} gap={'2'} align={'end'}>
                <MapRotationControl />
                <ZoomControl />
              </Flex>
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
          <ShipPositionLayer crs={crs} />
          <LabelledGraticuleLayer
            id="graticule-layer"
            title="Graticule"
            opacity={0.75}
            graticuleBounds={{
              minLatitude: CRS_TO_HEMISPHERE[crs] === 'N' ? 50 : -89,
              maxLatitude: CRS_TO_HEMISPHERE[crs] === 'N' ? 89 : -50,
            }}
          />
          <SynchroniseLayerTheme />
        </ArcMapView>
      )}
    </Box>
  );
}
