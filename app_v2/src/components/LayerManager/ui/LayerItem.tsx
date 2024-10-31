import { css } from '@styled-system/css';
import { Flex } from '@styled-system/jsx';
import { useSelector } from '@xstate/react';

import Checkbox from '@/components/common/forms/Checkbox';
import Slider from '@/components/common/forms/Slider';
import Typography from '@/components/common/Typography';
import { LayerStatusBadge, LayerStatusCircle } from '@/components/LayerStatus';
import { LayerStatus } from '@/types';

import { LayerManagerContext } from '../LayerManagerProvider';
import { LayerMachineActor } from '../machines/types';

export function LayerItem({ layerActor }: { layerActor: LayerMachineActor }) {
  const { layerName, opacity } = useSelector(layerActor, ({ context }) => ({
    layerName: context.layerName,
    opacity: context.opacity,
  }));
  const isEnabled = useSelector(layerActor, (state) => state.matches('enabled'));

  const status = LayerManagerContext.useSelector((state) => {
    const layer = state.context.layers.find((l) => l.layerActor.id === layerActor.id);
    if (layer) {
      const mapProduct = layer.layerData?.mapProduct;
      if (mapProduct) {
        if (mapProduct.static) {
          return 'static';
        }
        return mapProduct.status;
      }
    }
    return 'offline';
  }) as LayerStatus;

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
        <Flex gap="2" alignItems="center">
          <LayerStatusCircle status={status} />
          <Typography>{layerName} /</Typography>
          <LayerStatusBadge status={status} />
        </Flex>
      </Checkbox>
      <Slider
        label="Opacity"
        minValue={0}
        maxValue={100}
        step={1}
        value={opacity * 100}
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
