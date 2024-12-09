import { css } from '@styled-system/css';
import { Box, Divider, Stack } from '@styled-system/jsx';

import ShipInfo from './ShipInfo';
import ShipToolbar from './ShipToolbar';

function SensorInfoPanel() {
  return (
    <Stack
      gap="0"
      id="sensor-info-panel"
      className={css({
        smDown: {
          flexDirection: 'column-reverse',
        },
        borderWidth: 'thin',
        borderColor: 'app.accent',
        borderRadius: 'md',
        bg: 'bg.base',
        shadow: 'md',
        width: '[22rem]',
        maxWidth: '[calc(100vw - 30px)]',
        pointerEvents: 'auto',
      })}
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
