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
      display: 'flex',
      gap: '2',
      flexDirection: 'column',
      w: 'full',
      listStyle: 'none',
    },
    itemWrapper: {
      display: 'flex',
      gap: '2',
      alignItems: 'center',
      borderColor: 'bg.base.border',
      borderRadius: 'sm',
      borderWidth: 'thin',
      p: '1',
      px: '2',
      borderStyle: 'solid',
      _last: {
        mb: '2',
      },
    },
    measurementInfo: {
      display: 'flex',
      gap: '2',
      flexGrow: 1,
      alignItems: 'center',
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
                  className={css({ w: 'fit' })}
                  onPress={() => mapView.goTo(graphic.geometry)}
                  variant="surface"
                  contained
                  icon={<SvgIcon name="icon-zoom-to" size={14} />}
                  aria-label={'Zoom to Measurement'}
                />

                <IconButton
                  className={css({ w: 'fit' })}
                  onPress={clear}
                  variant="surface"
                  contained
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
