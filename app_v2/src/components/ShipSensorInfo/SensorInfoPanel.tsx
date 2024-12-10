import { css } from '@styled-system/css';
import { Box, Divider, Stack } from '@styled-system/jsx';

import ShipInfo from './ShipInfo';
import ShipToolbar from './ShipToolbar';

function SensorInfoPanel() {
  return (
    <Stack
      className={css({
        borderColor: 'app.accent',
        borderRadius: 'md',
        borderWidth: 'thin',
        width: '[22rem]',
        maxWidth: '[calc(100vw - 30px)]',
        bg: 'bg.base',
        shadow: 'md',
        pointerEvents: 'auto',
        smDown: {
          flexDirection: 'column-reverse',
        },
      })}
      id="sensor-info-panel"
      gap="0"
    >
      <Box p="2">
        <ShipInfo />
      </Box>
      <Divider orientation="horizontal" color="bg.base.border" />
      <ShipToolbar />
    </Stack>
  );
}

export default SensorInfoPanel;
