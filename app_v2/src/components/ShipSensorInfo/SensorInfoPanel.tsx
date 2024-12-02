import { css } from '@styled-system/css';
import { Box, Divider } from '@styled-system/jsx';

import ShipInfo from './ShipInfo';
import ShipToolbar from './ShipToolbar';

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
        width: '[22rem]',
        pointerEvents: 'auto',
      })}
    >
      <Box p="2">
        <ShipInfo />
      </Box>
      <Divider orientation="horizontal" color="bg.base.border" />
      <ShipToolbar />
    </div>
  );
}

export default SensorInfoPanel;
