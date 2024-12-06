import { css, sva } from '@styled-system/css';
import { token } from '@styled-system/tokens';
import React from 'react';

import { IconButton } from '@/components/common/Button';
import SvgIcon from '@/components/common/SvgIcon';
import { Text } from '@/components/common/Typography';
import { MapGraphicPolylinePreviewSVG } from '@/components/PolylinePreviewSVG';
import { Measurement } from '@/features/arcgis/hooks/measurements/types';
import { getDisplayUnit } from '@/features/arcgis/hooks/measurements/utils';

const listRecipe = sva({
  slots: ['root', 'itemWrapper', 'measurementInfo', 'measurementText'],
  base: {
    root: {
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: '2',
      w: 'full',
    },
    itemWrapper: {
      display: 'flex',
      alignItems: 'center',
      borderColor: 'bg.base.border',
      borderWidth: 'thin',
      borderStyle: 'solid',
      borderRadius: 'sm',
      gap: '2',
      p: '1',
      px: '2',
      _last: {
        mb: '2',
      },
    },
    measurementInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '2',
      flexGrow: 1,
      minWidth: '0',
    },
    measurementText: {
      flexGrow: 1,
    },
  },
});

export function MeasurementList({
  measurements,
  mapView,
}: {
  measurements: Measurement[];
  mapView: __esri.MapView;
}) {
  const { root, itemWrapper, measurementInfo, measurementText } = listRecipe();
  const polylinePreviewOptions = React.useMemo(() => {
    return {
      size: 36,
      padding: 6,
      bgColor: token('colors.bg.surface'),
      lineColor: token('colors.fg.accent'),
    };
  }, []);

  return (
    <ul className={root}>
      {measurements.map(({ graphic, id, clear }) => {
        return (
          <React.Fragment key={id}>
            <li className={itemWrapper}>
              <MapGraphicPolylinePreviewSVG
                mapView={mapView}
                graphic={graphic}
                options={polylinePreviewOptions}
              />
              <div className={measurementInfo}>
                <Text className={measurementText}>
                  <b>Total Length:</b> {graphic.attributes.length.toFixed(2)}{' '}
                  {getDisplayUnit(graphic.attributes.unit)}
                </Text>
                <IconButton
                  onPress={() => mapView.goTo(graphic.geometry)}
                  variant="surface"
                  contained
                  className={css({ w: 'fit' })}
                  icon={<SvgIcon name="icon-zoom-to" size={14} />}
                  aria-label={'Zoom to Measurement'}
                />

                <IconButton
                  onPress={clear}
                  variant="surface"
                  contained
                  className={css({ w: 'fit' })}
                  icon={<SvgIcon name="icon-trash" size={14} />}
                  aria-label={'Delete Measurement'}
                />
              </div>
            </li>
          </React.Fragment>
        );
      })}
    </ul>
  );
}
