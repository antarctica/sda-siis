import { Point } from '@arcgis/core/geometry';
import { Divider, Flex } from '@styled-system/jsx';

import { useShipPosition } from '@/api/useShipSensorData';
import { useCurrentMapView } from '@/arcgis/hooks';
import { IconButton } from '@/components/common/Button';
import { selectFollowShip, setFollowShip } from '@/store/features/shipSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { decimalToDMS } from '@/utils/formatCoordinates';

import SvgIcon from '../common/SvgIcon';
import Typography from '../common/Typography';
import StatusBadge from './StatusBadge';

function PositionInfo() {
  const {
    latitude,
    longitude,
    isOnline: positionOnline,
    isError: positionError,
  } = useShipPosition();
  const mapView = useCurrentMapView();
  const followShip = useAppSelector(selectFollowShip);
  const dispatch = useAppDispatch();

  return (
    <Flex gap="2" pl="2" justifyContent={'space-between'} align="center" w="full">
      {!positionError && positionOnline ? (
        <>
          <Typography bold>
            {decimalToDMS(latitude ?? 0, true)}, {decimalToDMS(longitude ?? 0, false)}
          </Typography>
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
            mapView?.goTo({ target: point, scale: 500000 });
          }}
        />
        <Divider orientation="vertical" color="bg.base.border" h="8" thickness="thin" />
        <IconButton
          variant="surface"
          tooltipPlacement="bottom"
          icon={<SvgIcon name={followShip ? 'icon-follow-off' : 'icon-follow'} size={16} />}
          aria-label={followShip ? 'Stop following ship' : 'Follow ship position'}
          onPress={() => dispatch(setFollowShip(!followShip))}
        />
      </Flex>
    </Flex>
  );
}

export default PositionInfo;
