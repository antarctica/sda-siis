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
      className={css({
        borderColor: 'bg.base.border',
        borderRadius: 'md',
        borderWidth: 'thin',
        w: 'fit',
        bg: 'bg.base',
        boxShadow: 'md',
        pointerEvents: 'auto',
      })}
      gap={'0'}
    >
      <MapButton
        className={css({
          borderBottomRadius: 'radii.none',
        })}
        icon={<SvgIcon name="icon-add" size={16} />}
        aria-label="Zoom In"
        disableTooltip
        isDisabled={canZoomIn ? undefined : true}
        onPress={() => widget.zoomIn()}
        variant="surface"
        isContainer={false}
      />
      <Divider thickness={'thin'} w="full" color="bg.base.border"></Divider>
      <MapButton
        className={css({
          borderTopRadius: 'radii.none',
        })}
        icon={<SvgIcon name="icon-subtract" size={16} />}
        aria-label="Zoom Out"
        disableTooltip
        isDisabled={canZoomOut ? undefined : true}
        onPress={() => widget.zoomOut()}
        variant="surface"
        isContainer={false}
      />
    </Stack>
  );
}

export default ZoomControl;
