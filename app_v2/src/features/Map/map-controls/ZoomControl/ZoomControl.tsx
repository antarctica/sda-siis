import ZoomVM from '@arcgis/core/widgets/Zoom/ZoomViewModel';
import { css } from '@styled-system/css';
import { Divider, Stack } from '@styled-system/jsx';
import * as React from 'react';

import { MapButton } from '@/components/common/Button';
import SvgIcon from '@/components/common/SvgIcon';
import { useCurrentMapView, useWatchState } from '@/features/arcgis/hooks';

function ZoomControl() {
  const mapView = useCurrentMapView();
  const widget = React.useMemo(() => new ZoomVM({ view: mapView }), [mapView]);

  const canZoomIn = useWatchState(() => widget.canZoomIn) ?? false;
  const canZoomOut = useWatchState(() => widget.canZoomOut) ?? false;

  return (
    <Stack
      gap={'0'}
      className={css({
        boxShadow: 'md',
        bg: 'bg.base',
        borderColor: 'bg.base.border',
        borderWidth: 'thin',
        borderRadius: 'md',
        w: 'fit',
        pointerEvents: 'auto',
      })}
    >
      <MapButton
        icon={<SvgIcon name="icon-add" size={16} />}
        aria-label="Zoom In"
        disableTooltip
        isDisabled={canZoomIn ? undefined : true}
        onPress={() => widget.zoomIn()}
        variant="surface"
        isContainer={false}
        className={css({
          borderBottomRadius: 'radii.none',
        })}
      />
      <Divider w="full" thickness={'thin'} color="bg.base.border"></Divider>
      <MapButton
        icon={<SvgIcon name="icon-subtract" size={16} />}
        aria-label="Zoom Out"
        disableTooltip
        isDisabled={canZoomOut ? undefined : true}
        onPress={() => widget.zoomOut()}
        variant="surface"
        isContainer={false}
        className={css({
          borderTopRadius: 'radii.none',
        })}
      />
    </Stack>
  );
}

export default ZoomControl;
