import { SpatialReference } from '@arcgis/core/geometry';
import { ArcgisPlacement } from '@arcgis/map-components-react';
import { css, cva } from '@styled-system/css';
import { Box, Flex, Stack } from '@styled-system/jsx';

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
      bg: 'siis_darkgreyAlpha.a12 !important',
      // eslint-disable-next-line @pandacss/no-hardcoded-color
      color: 'fg !important',
      _dark: {
        // eslint-disable-next-line @pandacss/no-hardcoded-color
        bg: 'siis_greyAlpha.a11 !important',
        // eslint-disable-next-line @pandacss/no-hardcoded-color
        color: 'fg.accent !important',
      },
    },
  },
});

export function Map({ crs, initialExtent }: { crs: MapCRS; initialExtent?: __esri.Extent }) {
  const map = useMapInitialization(crs);
  const isMobile = useIsMobile();

  const validatedExtent = initialExtent ? validateExtentInCRS(initialExtent, crs) : undefined;

  return (
    <Box w={'full'} h={'full'} position={'relative'} className={mapStyles()}>
      {map && (
        <ArcMapView
          id={MAP_ID}
          map={map}
          spatialReference={new SpatialReference({ wkid: CRS_LOOKUP[crs].wkid })}
          scale={25000000}
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
              position="bottom-right"
              className={css({ pointerEvents: '[none !important]' })}
            >
              <Stack gap={'4'} align={'end'}>
                <MapRotationControl crs={crs} />
                <ZoomControl />
              </Stack>
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
          <GraticuleLayer
            id="graticule-layer"
            title="Graticule"
            opacity={0.75}
            graticuleBounds={CRS_LOOKUP[crs].graticuleBounds}
          />
          <SynchroniseLayerTheme />
        </ArcMapView>
      )}
    </Box>
  );
}
