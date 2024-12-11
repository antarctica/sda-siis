import { css } from '@styled-system/css';
import { Box, Flex } from '@styled-system/jsx';
import React from 'react';

import { Button, ToggleButton } from '@/components/common/Button';
import SvgIcon from '@/components/common/SvgIcon';
import { Text, Title } from '@/components/common/Typography';
import { useMeasureLine } from '@/features/arcgis/hooks/measurements/useMeasureLine';
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

  const { startMeasurement, measurements, isActive, clearAll } = useMeasureLine(
    mapView,
    measurementGroupID,
    measurementUnit,
    measurementOptions,
  );

  return (
    <Flex direction="column" align={'start'} w="full">
      <Box w="full" mb="2">
        <Title as="h3" bold size="body" margin={false}>
          Line Measurements
        </Title>
        <Text textStyle="description">Measure the length of a line drawn on the map.</Text>
      </Box>
      <Flex gap="2" direction="column" w="full">
        <MeasurementList measurements={measurements} mapView={mapView} />
        <Flex gap="2">
          <ToggleButton
            className={css({ flexGrow: '1' })}
            size="md"
            isSelected={isActive}
            onPress={() => startMeasurement()}
          >
            <SvgIcon name="icon-add-circle-graphic" size={16} />
            Add Line Measurement
          </ToggleButton>
          {measurements.length > 0 && (
            <Button
              className={css({ flexGrow: '1' })}
              size="md"
              variant="outline"
              onPress={clearAll}
            >
              {`Clear All (${measurements.length})`}
            </Button>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default MeasureLine;
