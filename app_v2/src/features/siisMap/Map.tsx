import { SpatialReference } from '@arcgis/core/geometry';
import { ArcgisPlacement } from '@arcgis/map-components-react';
import { css, cva } from '@styled-system/css';
import { Box, Flex, Stack } from '@styled-system/jsx';
import React from 'react';

import { MAP_ID } from '@/config/constants';
import { CRS_LOOKUP, validateExtentInCRS } from '@/config/map';
import { ArcMapView } from '@/features/arcgis/components/ArcView/ArcMapView';
import useIsMobile from '@/hooks/useIsMobile';
import { MapCRS } from '@/types';

import SensorInfo from '../../components/ShipSensorInfo';
import { GraticuleLayer } from './layers/GraticuleLayer';
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
      // eslint-disable-next-line @pandacss/no-hardcoded-color
      color: 'fg !important',
      // eslint-disable-next-line @pandacss/no-hardcoded-color
      bg: 'siis_darkgreyAlpha.a12 !important',
      _dark: {
        // eslint-disable-next-line @pandacss/no-hardcoded-color
        color: 'fg.accent !important',
        // eslint-disable-next-line @pandacss/no-hardcoded-color
        bg: 'siis_greyAlpha.a11 !important',
      },
    },
  },
});

export function Map({ crs, initialExtent }: { crs: MapCRS; initialExtent?: __esri.Extent }) {
  const map = useMapInitialization(crs);
  const isMobile = useIsMobile();

  const validatedExtent = React.useMemo(
    () => (initialExtent ? validateExtentInCRS(initialExtent, crs) : undefined),
    [initialExtent, crs],
  );
  return (
    <Box className={mapStyles()} position={'relative'} w={'full'} h={'full'}>
      {map && (
        <ArcMapView
          id={MAP_ID}
          map={map}
          spatialReference={new SpatialReference({ wkid: CRS_LOOKUP[crs].wkid })}
          constraints={{
            rotationEnabled: false,
            minScale: 50e6,
            maxScale: 10e3,
            geometry: CRS_LOOKUP[crs].extentConstraint,
          }}
          onArcgisViewReadyChange={(event) => {
            console.debug('onArcgisViewReadyChange', event.target.view);
          }}
          extent={validatedExtent}
          center={validatedExtent ? undefined : CRS_LOOKUP[crs].center}
          scale={25000000}
          padding={
            isMobile
              ? {
                  top: 100,
                  left: 100,
                  bottom: window.innerWidth / (5 / 3),
                  right: 100,
                }
              : {
                  top: 100,
                  left: 100,
                  bottom: 100,
                  right: 100,
                }
          }
        >
          {!isMobile && (
            <ArcgisPlacement
              className={css({ pointerEvents: '[none !important]' })}
              position="bottom-right"
            >
              <Stack gap={'4'} align={'end'}>
                <MapRotationControl crs={crs} />
                <ZoomControl />
              </Stack>
            </ArcgisPlacement>
          )}
          <ArcgisPlacement position="bottom-left">
            <Flex gap={'2'} direction={'column'}>
              <ScaleControl />
              {!isMobile && <CursorLocationControl />}
            </Flex>
          </ArcgisPlacement>{' '}
          <ArcgisPlacement position={isMobile ? 'bottom-right' : 'top-right'}>
            <SensorInfo />
          </ArcgisPlacement>
          <ShipPositionLayer crs={crs} />
          <GraticuleLayer
            id="graticule-layer"
            title="Graticule"
            graticuleBounds={CRS_LOOKUP[crs].graticuleBounds}
            opacity={0.75}
          />
          <SynchroniseLayerTheme />
        </ArcMapView>
      )}
    </Box>
  );
}
