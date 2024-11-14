import { Point, SpatialReference } from '@arcgis/core/geometry';
import { project } from '@arcgis/core/geometry/projection';
import { css } from '@styled-system/css';
import { Divider, Flex } from '@styled-system/jsx';
import React from 'react';
import { Toolbar } from 'react-aria-components';

import { useShipPosition } from '@/api/useShipSensorData';
import { useCurrentMapView } from '@/arcgis/hooks';
import { IconButton } from '@/components/common/Button';
import { CRS_LOOKUP, isPointVisibleInCRS } from '@/config/constants';
import { selectCurrentCRS } from '@/store/features/projectionSlice';
import { selectFollowShip, setFollowShip } from '@/store/features/shipSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { decimalToDMS } from '@/utils/formatCoordinates';

import SvgIcon from '../common/SvgIcon';
import Typography from '../common/Typography';
import ShipSensorStatusBadge from './ShipSensorStatusBadge';

function PositionInfo() {
  const {
    latitude,
    longitude,
    isOnline: positionOnline,
    isError: positionError,
  } = useShipPosition();
  const mapView = useCurrentMapView();
  const currentCRS = useAppSelector(selectCurrentCRS);
  const followShip = useAppSelector(selectFollowShip);
  const dispatch = useAppDispatch();
  const isPointVisible = React.useMemo(() => {
    if (!latitude || !longitude || !currentCRS) return false;
    const isVisible = isPointVisibleInCRS(
      project(new Point({ latitude, longitude, spatialReference: SpatialReference.WGS84 }), {
        wkid: CRS_LOOKUP[currentCRS].wkid,
      }) as Point,
      currentCRS,
    );
    return isVisible;
  }, [latitude, longitude, currentCRS]);

  return (
    <Flex gap="2" pl="2" justifyContent={'space-between'} align="center" w="full">
      {!positionError && positionOnline ? (
        <>
          <Typography bold>
            {decimalToDMS(latitude ?? 0, true)}, {decimalToDMS(longitude ?? 0, false)}
          </Typography>
        </>
      ) : (
        <ShipSensorStatusBadge variant="error">No position data</ShipSensorStatusBadge>
      )}
      <Toolbar
        aria-label="Ship position toolbar"
        className={css({ alignItems: 'center', display: 'flex' })}
      >
        <Divider orientation="vertical" color="bg.base.border" h="10" thickness="thin" />
        <IconButton
          isDisabled={!isPointVisible}
          variant="surface"
          icon={<SvgIcon name="icon-zoom-to" size={16} />}
          tooltipPlacement="bottom"
          size="lg"
          aria-label="Zoom to ship position"
          className={css({ px: '2.5' })}
          onPress={() => {
            const point = new Point({
              latitude: latitude ?? 0,
              longitude: longitude ?? 0,
            });
            mapView?.goTo({ target: point, scale: 500000 });
          }}
        />
        <Divider orientation="vertical" color="bg.base.border" h="10" thickness="thin" />
        <IconButton
          isDisabled={!isPointVisible}
          size="lg"
          className={css({ px: '2.5' })}
          variant="surface"
          tooltipPlacement="bottom"
          icon={<SvgIcon name={followShip ? 'icon-follow-off' : 'icon-follow'} size={16} />}
          aria-label={followShip ? 'Stop following ship' : 'Follow ship position'}
          onPress={() => dispatch(setFollowShip(!followShip))}
        />
      </Toolbar>
    </Flex>
  );
}

export default PositionInfo;
