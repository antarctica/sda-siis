import { css } from '@styled-system/css';
import { useSelector } from '@xstate/react';

import Checkbox from '@/components/common/forms/Checkbox';
import Slider from '@/components/common/forms/Slider';
import Typography from '@/components/common/Typography';

import { LayerMachineActor } from '../machines/types';

export function LayerItem({ layerActor }: { layerActor: LayerMachineActor }) {
  const { layerName } = useSelector(layerActor, ({ context }) => ({
    layerName: context.layerName,
  }));
  const isEnabled = useSelector(layerActor, (state) => state.matches('enabled'));

  return (
    <li>
      <Checkbox
        onChange={() => {
          layerActor.send({
            type: isEnabled ? 'LAYER.DISABLED' : 'LAYER.ENABLED',
          });
        }}
        isSelected={isEnabled}
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
        })}
      >
        <Typography>{layerName}</Typography>
      </Checkbox>
      <Slider label="Opacity" />
    </li>
  );
}
