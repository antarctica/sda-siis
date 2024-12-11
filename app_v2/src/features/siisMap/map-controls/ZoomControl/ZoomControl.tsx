import ZoomVM from '@arcgis/core/widgets/Zoom/ZoomViewModel';
import { css } from '@styled-system/css';
import { Divider, Stack } from '@styled-system/jsx';
import * as React from 'react';

import { IconButton } from '@/components/common/Button';
import SvgIcon from '@/components/common/SvgIcon';
import { useCurrentMapView, useWatchState } from '@/features/arcgis/hooks';

function ZoomControl() {
  const mapView = useCurrentMapView();
  const widget = React.useMemo(() => new ZoomVM({ view: mapView }), [mapView]);

  const canZoomIn = useWatchState(() => widget.canZoomIn) ?? false;
  const canZoomOut = useWatchState(() => widget.canZoomOut) ?? false;

  return (
    <Stack
      className={css({
        borderColor: 'bg.base.border',
        borderRadius: 'md',
        borderWidth: 'thin',
        bg: 'bg.base',
        boxShadow: 'md',
        pointerEvents: 'auto',
      })}
      gap={'0'}
    >
      <IconButton
        className={css({
          borderBottomRadius: 'radii.none',
          w: '12',
          h: '12',
        })}
        icon={<SvgIcon name="icon-add" size={16} />}
        aria-label="Zoom In"
        disableTooltip
        isDisabled={canZoomIn ? false : true}
        onPress={() => widget.zoomIn()}
        variant="mapButton"
        contained
      />
      <Divider thickness={'thin'} w="full" color="bg.base.border"></Divider>
      <IconButton
        className={css({
          borderTopRadius: 'radii.none',
          w: '12',
          h: '12',
        })}
        icon={<SvgIcon name="icon-subtract" size={16} />}
        aria-label="Zoom Out"
        disableTooltip
        isDisabled={canZoomOut ? undefined : true}
        onPress={() => widget.zoomOut()}
        variant="mapButton"
        contained
      />
    </Stack>
  );
}

export default ZoomControl;
