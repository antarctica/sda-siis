import { Point } from '@arcgis/core/geometry';
import Graphic from '@arcgis/core/Graphic';
import { SimpleMarkerSymbol } from '@arcgis/core/symbols';
import { Divider, Flex } from '@styled-system/jsx';

import { useShipPosition } from '@/api/useShipSensorData';
import { ArcGraphicsLayer } from '@/arcgis/ArcLayer/generated/ArcGraphicsLayer';
import { useCurrentMapView } from '@/arcgis/hooks';
import { decimalToDMS } from '@/utils/formatCoordinates';

import { IconButton } from '../Button';
import SvgIcon from '../SvgIcon';
import Typography from '../Typography';
import StatusBadge from './StatusBadge';

function PositionInfo() {
  const {
    latitude,
    longitude,
    isOnline: positionOnline,
    isError: positionError,
  } = useShipPosition();
  const mapView = useCurrentMapView();

  return (
    <Flex gap="2" pl="2" justifyContent={'space-between'} align="center" w="full">
      {!positionError && positionOnline ? (
        <>
          <Typography bold>
            {decimalToDMS(latitude ?? 0, true)}, {decimalToDMS(longitude ?? 0, false)}
          </Typography>
          <ArcGraphicsLayer
            id="graphics-layer"
            graphics={[
              new Graphic({
                geometry: new Point({
                  latitude: latitude ?? 0,
                  longitude: longitude ?? 0,
                }),
                symbol: new SimpleMarkerSymbol({
                  color: 'red',
                  size: 10,
                }),
              }),
            ]}
          ></ArcGraphicsLayer>
        </>
      ) : (
        <StatusBadge variant="error">No position data</StatusBadge>
      )}
      <Flex align="center">
        <Divider orientation="vertical" color="bg.base.border" h="8" thickness="thin" />
        <IconButton
          variant="surface"
          icon={<SvgIcon name="icon-zoom-to" size={16} />}
          tooltipPlacement="bottom"
          aria-label="Zoom to ship position"
          onPress={() => {
            const point = new Point({
              latitude: latitude ?? 0,
              longitude: longitude ?? 0,
            });
            mapView?.goTo({ target: point, zoom: 10 });
          }}
        />
        <Divider orientation="vertical" color="bg.base.border" h="8" thickness="thin" />
        <IconButton
          variant="surface"
          tooltipPlacement="bottom"
          icon={<SvgIcon name="icon-follow" size={16} />}
          aria-label="Follow ship position"
        />
      </Flex>
    </Flex>
  );
}

export default PositionInfo;
