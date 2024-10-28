import { css } from '@styled-system/css';
import { useSelector } from '@xstate/react';

import Checkbox from '@/components/common/forms/Checkbox';
import Slider from '@/components/common/forms/Slider';
import Typography from '@/components/common/Typography';

import { LayerMachineActor } from '../machines/types';

export function LayerItem({ layerActor }: { layerActor: LayerMachineActor }) {
  const { layerName, opacity } = useSelector(layerActor, ({ context }) => ({
    layerName: context.layerName,
    opacity: context.opacity,
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
      <Slider
        label="Opacity"
        minValue={0}
        maxValue={100}
        step={1}
        defaultValue={opacity * 100}
        onChange={(value) => {
          layerActor.send({
            type: 'LAYER.SET_OPACITY',
            opacity: value / 100,
          });
        }}
      />
    </li>
  );
}
