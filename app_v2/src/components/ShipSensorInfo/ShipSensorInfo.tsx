import { css } from '@styled-system/css';
import { Box, Divider, Flex } from '@styled-system/jsx';
import { useState } from 'react';

import {
  useShipDepth,
  useShipHeading,
  useShipPosition,
  useShipSpeed,
} from '@/api/useShipSensorData';
import { decimalToDMS } from '@/utils/formatCoordinates';

import { IconButton, MapButton } from '../Button';
import DataGrid from '../DataGrid';
import SvgIcon from '../SvgIcon';
import Typography, { Heading } from '../Typography';

export function SensorInfo() {
  const [isExpanded, setIsExpanded] = useState(true);
  const {
    latitude,
    longitude,
    isOnline: positionOnline,
    // isLoading: positionLoading,
    // isError: positionError,
  } = useShipPosition();
  const {
    speed,
    isOnline: speedOnline,
    // isLoading: speedLoading,
    // isError: speedError,
  } = useShipSpeed();
  const {
    heading,
    isOnline: headingOnline,
    // isLoading: headingLoading,
    // isError: headingError,
  } = useShipHeading();
  const {
    depth,
    isOnline: depthOnline,
    // isLoading: depthLoading,
    // isError: depthError,
  } = useShipDepth();

  const toggleSensorInfo = () => setIsExpanded(!isExpanded);

  return (
    <div
      className={css({
        position: 'relative',
      })}
    >
      <MapButton
        icon={<SvgIcon name="icon-ship" size={16} />}
        aria-label={isExpanded ? 'Hide ship sensor info' : 'Show ship sensor info'}
        aria-expanded={isExpanded}
        aria-controls="sensor-info-panel"
        onPress={toggleSensorInfo}
        className={css({
          position: 'absolute',
          top: '0',
          right: '0',
          ...(isExpanded ? { shadow: '[none]' } : {}),
        })}
      />
      {isExpanded && (
        <div
          id="sensor-info-panel"
          className={css({
            borderWidth: 'thin',
            borderColor: 'bg.base.border',
            borderRadius: 'md',
            bg: 'bg.base',
            shadow: 'md',
          })}
        >
          <Box p="2">
            <Heading as="h2" heading="heading-4" className={css({ pr: '10' })}>
              RRS Sir David Attenborough
            </Heading>
            <DataGrid
              data={[
                { label: 'Speed', value: speedOnline ? `${speed} knots` : 'Offline' },
                { label: 'Heading', value: headingOnline ? `${heading}°` : 'Offline' },
                { label: 'Depth', value: depthOnline ? `${depth} meters` : 'Offline' },
              ]}
            />
          </Box>
          <Divider orientation="horizontal" color="bg.base.border" />
          <Flex gap="2" pl="2" justifyContent={'space-between'} align="center" w="full">
            {positionOnline && (
              <>
                <Typography bold>
                  {decimalToDMS(latitude ?? 0, true)}, {decimalToDMS(longitude ?? 0, false)}
                </Typography>
              </>
            )}
            <Flex align="center">
              <Divider orientation="vertical" color="bg.base.border" h="8" thickness="thin" />
              <IconButton
                variant="surface"
                icon={<SvgIcon name="icon-ship" size={16} />}
                tooltipPlacement="bottom"
                aria-label="Copy coordinates"
              />
              <Divider orientation="vertical" color="bg.base.border" h="8" thickness="thin" />
              <IconButton
                variant="surface"
                tooltipPlacement="bottom"
                icon={<SvgIcon name="icon-ship" size={16} />}
                aria-label="Copy coordinates"
              />
            </Flex>
          </Flex>
        </div>
      )}
    </div>
  );
}

export default SensorInfo;
