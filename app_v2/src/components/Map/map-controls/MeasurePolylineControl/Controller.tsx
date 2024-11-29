import { Flex } from '@styled-system/jsx';
import React from 'react';

import { useMeasureLine } from '@/arcgis/hooks/measurements/useMeasureLine';
import { ToggleButton } from '@/components/common/Button';
import SvgIcon from '@/components/common/SvgIcon';
import { selectDefaultMeasurementUnit } from '@/store/features/appSlice';
import { useAppSelector } from '@/store/hooks';

import { MeasurementList } from './MeasurementList';

function MeasureLine({
  mapView,
  graphicsLayer,
  measurementID,
}: {
  mapView: __esri.MapView;
  graphicsLayer: __esri.GraphicsLayer;
  measurementID?: string;
}) {
  const measurementUnit = useAppSelector(selectDefaultMeasurementUnit);
  const measurementOptions = React.useMemo(
    () => ({
      graphicsLayer,
    }),
    [graphicsLayer],
  );

  const internalId = React.useId();
  const measurementGroupID = React.useMemo(() => {
    return measurementID ?? internalId;
  }, [measurementID, internalId]);

  const { startMeasurement, measurements, isActive } = useMeasureLine(
    mapView,
    measurementGroupID,
    measurementUnit,
    measurementOptions,
  );

  return (
    <Flex direction="column" gap="2" align={'start'} w="full">
      <ToggleButton isSelected={isActive} onPress={() => startMeasurement()}>
        <SvgIcon name="icon-map-polyline" size={16} />
        Add Line Measurement
      </ToggleButton>

      <MeasurementList measurements={measurements} mapView={mapView} />
    </Flex>
  );
}

export default MeasureLine;
