import { css } from '@styled-system/css';
import { useState } from 'react';

import { useSensorData } from '@/api/useShipSensorData';
import { MapButton } from '@/components/common/Button';

import PulsatingDot from '../common/PulsatingDot';
import SvgIcon from '../common/SvgIcon';
import SensorInfoPanel from './SensorInfoPanel';

function SensorStatusDot() {
  const { sensorStatus, isLoading } = useSensorData();

  if (isLoading) return null;

  const getVariant = (status: string) => {
    switch (status) {
      case 'ERROR':
      case 'OFFLINE':
        return 'error';
      case 'PARTIALLY_ONLINE':
        return 'warning';
      default:
        return 'success';
    }
  };

  return (
    <PulsatingDot
      className={css({
        position: 'absolute',
        top: '0',
        right: '0',
      })}
      radius={3}
      weight={6}
      variant={getVariant(sensorStatus)}
    />
  );
}

function SensorInfo() {
  const [isExpanded, setIsExpanded] = useState(true);

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
          ...(isExpanded
            ? {
                shadow: '[none]',
                borderColor: 'app.accent',
                borderStartRadius: '[0px]',
                borderBottomRadius: '[0px]',
              }
            : {}),
        })}
      />
      <SensorStatusDot />
      {isExpanded && <SensorInfoPanel />}
    </div>
  );
}

export default SensorInfo;
