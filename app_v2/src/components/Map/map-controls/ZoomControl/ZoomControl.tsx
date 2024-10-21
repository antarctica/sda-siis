import ZoomVM from '@arcgis/core/widgets/Zoom/ZoomViewModel';
import { css } from '@styled-system/css';
import { Divider, Flex } from '@styled-system/jsx';
import * as React from 'react';

import { useCurrentMapView, useWatchState } from '@/arcgis/hooks';
import { MapButton } from '@/components/Button';
import SvgIcon from '@/components/SvgIcon';

function ZoomControl() {
  const mapView = useCurrentMapView();
  const widget = React.useMemo(() => new ZoomVM({ view: mapView }), [mapView]);

  const canZoomIn = useWatchState(() => widget.canZoomIn) ?? false;
  const canZoomOut = useWatchState(() => widget.canZoomOut) ?? false;

  return (
    <Flex
      direction="column"
      className={css({
        boxShadow: 'md',
        bg: 'bg.base',
        borderColor: 'bg.base.border',
        borderWidth: 'thin',
        borderRadius: 'md',
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
          borderBottomRadius: '[0]',
        })}
      />
      <Divider w="full" thickness={'thin'} color="bg.base.border"></Divider>
      <MapButton
        icon={<SvgIcon name="icon-subtract" size={16} />}
        aria-label="Zoom Out"
        disableTooltip
        isDisabled={canZoomOut ? undefined : true}
        onPress={() => widget.zoomOut()}
        variant="mapButton"
        isContainer={false}
        className={css({
          borderTopRadius: '[0]',
        })}
      />
    </Flex>
  );
}

export default ZoomControl;
