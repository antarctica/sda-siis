import { css } from '@styled-system/css';
import { Box } from '@styled-system/jsx';

import { useShipDepth, useShipHeading, useShipSpeed } from '@/api/useShipSensorData';

import DataGrid from '../common/DataGrid';
import { Heading } from '../common/Typography';
import ShipSensorStatusBadge from './ShipSensorStatusBadge';

function ShipInfo() {
  const { speed, isOnline: speedOnline, isError: speedError } = useShipSpeed();
  const { heading, isOnline: headingOnline, isError: headingError } = useShipHeading();
  const { depth, isOnline: depthOnline, isError: depthError } = useShipDepth();

  return (
    <>
      <Heading as="h2" heading="heading-4" className={css({ pr: '10' })}>
        RRS Sir David Attenborough
      </Heading>
      <Box px="2">
        <DataGrid
          data={[
            {
              label: 'Speed',
              value: speedError ? (
                <ShipSensorStatusBadge variant="error" />
              ) : speedOnline ? (
                `${speed} knots`
              ) : (
                <ShipSensorStatusBadge variant="warning" />
              ),
            },
            {
              label: 'Heading',
              value: headingError ? (
                <ShipSensorStatusBadge variant="error" />
              ) : headingOnline ? (
                `${heading}°`
              ) : (
                <ShipSensorStatusBadge variant="warning" />
              ),
            },
            {
              label: 'Depth',
              value: depthError ? (
                <ShipSensorStatusBadge variant="error" />
              ) : depthOnline ? (
                `${depth} meters`
              ) : (
                <ShipSensorStatusBadge variant="warning" />
              ),
            },
          ]}
        />
      </Box>
    </>
  );
}

export default ShipInfo;
