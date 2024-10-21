import { css } from '@styled-system/css';
import { useState } from 'react';

import { MapButton } from '../Button';
import SvgIcon from '../SvgIcon';
import SensorInfoPanel from './SensorInfoPanel';

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
          ...(isExpanded ? { shadow: '[none]' } : {}),
        })}
      />
      {isExpanded && <SensorInfoPanel />}
    </div>
  );
}

export default SensorInfo;
