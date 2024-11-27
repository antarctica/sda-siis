import { Point } from '@arcgis/core/geometry';
import { css } from '@styled-system/css';
import { Divider, Flex } from '@styled-system/jsx';
import { Toolbar } from 'react-aria-components';

import { useCurrentMapView } from '@/arcgis/hooks';
import { IconButton } from '@/components/common/Button';
import { useShipPositionWithVisibility } from '@/hooks/useShipPositionWithVisibility';
import {
  selectFollowShip,
  selectShowDistanceCircles,
  setFollowShip,
  setShowDistanceCircles,
} from '@/store/features/shipSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import SvgIcon from '../common/SvgIcon';

function ShipToolbar() {
  const { latitude, longitude, isVisible } = useShipPositionWithVisibility();
  const mapView = useCurrentMapView();

  const followShip = useAppSelector(selectFollowShip);
  const showDistanceCircles = useAppSelector(selectShowDistanceCircles);
  const dispatch = useAppDispatch();

  return (
    <Flex gap="2" pl="2" justifyContent={'space-between'} align="center" w="full">
      <Toolbar
        aria-label="Ship position toolbar"
        className={css({ alignItems: 'center', display: 'flex', ml: '-2' })}
      >
        <IconButton
          isDisabled={!isVisible}
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
          isDisabled={!isVisible}
          size="lg"
          className={css({ px: '2.5' })}
          variant="surface"
          tooltipPlacement="bottom"
          icon={
            <SvgIcon
              name={showDistanceCircles ? 'icon-buffer-rings-off' : 'icon-buffer-rings'}
              size={16}
            />
          }
          aria-label={showDistanceCircles ? 'Hide distance circles' : 'Show distance circles'}
          onPress={() => dispatch(setShowDistanceCircles(!showDistanceCircles))}
        />
        <Divider orientation="vertical" color="bg.base.border" h="10" thickness="thin" />
        <IconButton
          isDisabled={!isVisible}
          size="lg"
          className={css({ px: '2.5' })}
          variant="surface"
          tooltipPlacement="bottom"
          icon={<SvgIcon name={followShip ? 'icon-follow-off' : 'icon-follow'} size={16} />}
          aria-label={followShip ? 'Stop following ship' : 'Follow ship position'}
          onPress={() => dispatch(setFollowShip(!followShip))}
        />
        <Divider orientation="vertical" color="bg.base.border" h="10" thickness="thin" />
      </Toolbar>
    </Flex>
  );
}

export default ShipToolbar;
