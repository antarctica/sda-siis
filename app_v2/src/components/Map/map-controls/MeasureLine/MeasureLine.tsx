import { css } from '@styled-system/css';
import { Box, Flex } from '@styled-system/jsx';
import { token } from '@styled-system/tokens';
import React from 'react';

import { MeasurementUnit } from '@/arcgis/hooks/measurements/types';
import { useMeasureLine } from '@/arcgis/hooks/measurements/useMeasureLine';
import { Button, IconButton } from '@/components/common/Button';
import SvgIcon from '@/components/common/SvgIcon';
import Typography from '@/components/common/Typography';
import PolylinePreviewSVG from '@/components/PolylinePreviewSVG';
import { Select } from '@/components/Select';

const selectItems = [
  { label: 'Kilometers', value: 'kilometers', key: 'kilometers' },
  { label: 'Miles', value: 'miles', key: 'miles' },
  { label: 'Nautical Miles', value: 'nautical-miles', key: 'nautical-miles' },
];

function MeasureLine({
  mapView,
  graphicsLayer,
}: {
  mapView: __esri.MapView;
  graphicsLayer: __esri.GraphicsLayer;
}) {
  const [unit, setUnit] = React.useState<MeasurementUnit>('kilometers');
  const measurementOptions = React.useMemo(
    () => ({
      graphicsLayer,
    }),
    [graphicsLayer],
  );
  const { startMeasurement, measurements } = useMeasureLine(
    mapView,
    'measurement-group-1',
    unit,
    measurementOptions,
  );
  return (
    <>
      <Button onPress={() => startMeasurement()}>Measure Line</Button>
      <Select
        label="Select a unit"
        items={selectItems}
        selectedKey={unit}
        onSelectionChange={(key) => setUnit(key as MeasurementUnit)}
      ></Select>
      <Flex direction="column" gap="2">
        {measurements.map(({ graphic, id, clear }) => {
          return (
            <Flex key={id} align="center" gap="2" w="full">
              <PolylinePreviewSVG
                mapView={mapView}
                polyline={graphic.geometry}
                options={{
                  size: 40,
                  padding: 6,
                  bgColor: token('colors.bg.surface'),
                  lineColor: token('colors.fg.accent'),
                }}
              />
              <Flex direction="row" gap="2" align="center" flexGrow={1} minWidth="0">
                <Typography>
                  Total Distance: {graphic.attributes.length.toFixed(2)} {graphic.attributes.unit}
                </Typography>

                <IconButton
                  className={css({
                    w: 'fit',
                  })}
                  onPress={clear}
                  variant="surface"
                  icon={<SvgIcon name="icon-trash" size="sm" />}
                  aria-label={'Delete Measurement'}
                />
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    </>
  );
}

export default MeasureLine;
