import HomeVM from '@arcgis/core/widgets/Home/HomeViewModel';
import { css } from '@styled-system/css';
import * as React from 'react';

import { IconButton } from '@/components/common/Button';
import SvgIcon from '@/components/common/SvgIcon';
import { useCurrentMapView, useWatchState } from '@/features/arcgis/hooks';

function HomeControl() {
  const mapView = useCurrentMapView();
  const widget = React.useMemo(() => new HomeVM({ view: mapView }), [mapView]);
  const isDisabled = useWatchState(() => widget.state === 'disabled') ?? false;
  return (
    <IconButton
      className={css({
        w: '12',
        h: '12',
      })}
      icon={<SvgIcon name="icon-home" size={12} />}
      aria-label="Home"
      isDisabled={isDisabled}
      onPress={() => widget.go()}
    />
  );
}

export default HomeControl;
