import { css } from '@styled-system/css';
import { Box, Divider } from '@styled-system/jsx';

import PositionInfo from './PositionInfo';
import ShipInfo from './ShipInfo';

function SensorInfoPanel() {
  return (
    <div
      id="sensor-info-panel"
      className={css({
        borderWidth: 'thin',
        borderColor: 'app.accent',
        borderRadius: 'md',
        bg: 'bg.base',
        shadow: 'md',
        width: 'sm',
      })}
    >
      <Box p="2">
        <ShipInfo />
      </Box>
      <Divider orientation="horizontal" color="bg.base.border" />
      <PositionInfo />
    </div>
  );
}

export default SensorInfoPanel;
