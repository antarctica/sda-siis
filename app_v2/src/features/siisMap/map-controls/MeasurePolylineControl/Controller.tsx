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
        <Title bold as="h3" size="body" margin={false}>
          Line Measurements
        </Title>
        <Text className={css({ textStyle: 'description' })}>
          Measure the length of a line drawn on the map.
        </Text>
      </Box>
      <Flex direction="column" gap="2" w="full">
        <MeasurementList measurements={measurements} mapView={mapView} />
        <Flex gap="2">
          <ToggleButton
            size="md"
            isSelected={isActive}
            onPress={() => startMeasurement()}
            className={css({ flexGrow: '1' })}
          >
            <SvgIcon name="icon-add-circle-graphic" size={16} />
            Add Line Measurement
          </ToggleButton>
          {measurements.length > 0 && (
            <Button
              size="md"
              className={css({ flexGrow: '1' })}
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
