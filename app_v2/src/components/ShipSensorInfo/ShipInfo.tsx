import { css } from '@styled-system/css';
import { Box } from '@styled-system/jsx';

import { useShipDepth, useShipHeading, useShipSpeed } from '@/api/useShipSensorData';

import DataGrid from '../DataGrid';
import { Heading } from '../Typography';
import StatusBadge from './StatusBadge';

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
                <StatusBadge variant="error" />
              ) : speedOnline ? (
                `${speed} knots`
              ) : (
                <StatusBadge variant="warning" />
              ),
            },
            {
              label: 'Heading',
              value: headingError ? (
                <StatusBadge variant="error" />
              ) : headingOnline ? (
                `${heading}°`
              ) : (
                <StatusBadge variant="warning" />
              ),
            },
            {
              label: 'Depth',
              value: depthError ? (
                <StatusBadge variant="error" />
              ) : depthOnline ? (
                `${depth} meters`
              ) : (
                <StatusBadge variant="warning" />
              ),
            },
          ]}
        />
      </Box>
    </>
  );
}

export default ShipInfo;
