import { css } from '@styled-system/css';
import { Flex } from '@styled-system/jsx';
import { useSelector } from '@xstate/react';

import Checkbox from '@/components/common/forms/Checkbox';
import Slider from '@/components/common/forms/Slider';
import Typography from '@/components/common/Typography';
import { LayerStatusBadge, LayerStatusCircle } from '@/components/LayerStatus';
import { LayerStatus } from '@/types';

import { LayerData } from '../LayerManagerProvider';
import { ManagedLayer } from '../machines/types';
import LayerDatePicker from './LayerDatePicker';

function getLayerStatus(layerData: LayerData): LayerStatus {
  const mapProduct = layerData?.mapProduct;
  if (mapProduct) {
    if (mapProduct.static) {
      return 'static';
    }
    return mapProduct.status as LayerStatus;
  }
  return 'offline';
}

export function LayerItem({ layerActor, layerData }: ManagedLayer<LayerData>) {
  const { layerName, opacity, timeInfo } = useSelector(layerActor, ({ context }) => ({
    layerName: context.layerName,
    opacity: context.opacity,
    timeInfo: context.timeInfo,
  }));
  const isEnabled = useSelector(layerActor, (state) => state.matches('enabled'));
  const status = getLayerStatus(layerData);

  return (
    <li className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
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
        <Flex gap="2" alignItems="center" grow={1} justifyContent="space-between">
          <Flex gap="2" alignItems="center">
            <LayerStatusCircle status={status} />
            <Typography>{layerName} </Typography>
          </Flex>
          <LayerStatusBadge status={status} />
        </Flex>
      </Checkbox>
      {timeInfo && timeInfo.type === 'single' && (
        <LayerDatePicker
          siisCode={layerData?.mapProduct?.code ?? ''}
          layerActor={layerActor}
          defaultValue={timeInfo.value}
        />
      )}
      <Slider
        label="Opacity"
        minValue={0}
        maxValue={100}
        step={1}
        value={opacity * 100}
        isDisabled={!isEnabled}
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
