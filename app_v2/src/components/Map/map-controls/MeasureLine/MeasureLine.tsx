import { SpatialReference } from '@arcgis/core/geometry';
import { project } from '@arcgis/core/geometry/projection';
import { Flex } from '@styled-system/jsx';
import React from 'react';

import { MeasurementUnit } from '@/arcgis/hooks/measurements/types';
import { useMeasureLine } from '@/arcgis/hooks/measurements/useMeasureLine';
import { Button } from '@/components/common/Button';
import Typography from '@/components/common/Typography';
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
        {measurements.map(({ graphic, id }) => {
          const polyline = graphic.geometry as __esri.Polyline;
          const projectedPolyline = project(polyline, SpatialReference.WGS84) as __esri.Polyline;
          const [path] = projectedPolyline.paths;
          if (!path || path.length < 2) return;
          return (
            <Typography key={id}>
              {id} - {graphic.attributes.length}nm
            </Typography>
          );
        })}
      </Flex>
    </>
  );
}

export default MeasureLine;
