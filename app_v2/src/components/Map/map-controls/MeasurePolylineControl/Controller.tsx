import { Flex } from '@styled-system/jsx';
import React from 'react';

import { MeasurementUnit } from '@/arcgis/hooks/measurements/types';
import { useMeasureLine } from '@/arcgis/hooks/measurements/useMeasureLine';
import { ToggleButton } from '@/components/common/Button';
import SvgIcon from '@/components/common/SvgIcon';
import { Select } from '@/components/Select';

import { MeasurementList } from './MeasurementList';

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
  const { startMeasurement, measurements, isActive } = useMeasureLine(
    mapView,
    'measurement-group-1',
    unit,
    measurementOptions,
  );
  return (
    <Flex direction="column" gap="2" align={'start'} w="full">
      <ToggleButton isSelected={isActive} onPress={() => startMeasurement()}>
        <SvgIcon name="icon-map-polyline" size={16} />
        Add Line Measurement
      </ToggleButton>
      <Select
        label="Select a unit"
        items={selectItems}
        selectedKey={unit}
        onSelectionChange={(key) => setUnit(key as MeasurementUnit)}
      ></Select>
      <MeasurementList measurements={measurements} mapView={mapView} />
    </Flex>
  );
}

export default MeasureLine;