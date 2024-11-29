import { sva } from '@styled-system/css';
import { Divider } from '@styled-system/jsx';
import { token } from '@styled-system/tokens';
import React from 'react';

import { useArcState } from '@/arcgis/hooks';
import { Measurement } from '@/arcgis/hooks/measurements/types';
import { getDisplayUnit } from '@/arcgis/hooks/measurements/utils';
import { IconButton } from '@/components/common/Button';
import SvgIcon from '@/components/common/SvgIcon';
import Typography from '@/components/common/Typography';
import PolylinePreviewSVG from '@/components/PolylinePreviewSVG';

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
      gap: '2',
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
  const [mapRotation] = useArcState(mapView, 'rotation');

  const polylinePreviewOptions = React.useMemo(() => {
    return {
      rotation: mapRotation,
      size: 36,
      padding: 6,
      bgColor: token('colors.bg.surface'),
      lineColor: token('colors.fg.accent'),
    };
  }, [mapRotation]);

  return (
    <ul className={root}>
      {measurements.map(({ graphic, id, clear }, index) => {
        return (
          <React.Fragment key={id}>
            <li className={itemWrapper}>
              <PolylinePreviewSVG
                mapView={mapView}
                polyline={graphic.geometry}
                options={polylinePreviewOptions}
              />
              <div className={measurementInfo}>
                <Typography className={measurementText}>
                  Total Length: {graphic.attributes.length.toFixed(2)}{' '}
                  {getDisplayUnit(graphic.attributes.unit)}
                </Typography>

                <IconButton
                  onPress={clear}
                  variant="surface"
                  icon={<SvgIcon name="icon-trash" size={14} />}
                  aria-label={'Delete Measurement'}
                />
              </div>
            </li>
            {index !== measurements.length - 1 && (
              <Divider orientation="horizontal" thickness={'thin'} color={'bg.base.border'} />
            )}
          </React.Fragment>
        );
      })}
    </ul>
  );
}
