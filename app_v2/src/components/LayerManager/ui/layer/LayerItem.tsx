import { fromDate, today } from '@internationalized/date';
import { css } from '@styled-system/css';
import { Flex } from '@styled-system/jsx';
import { useSelector } from '@xstate/react';

import Checkbox from '@/components/common/forms/Checkbox';
import Slider from '@/components/common/forms/Slider';
import Typography from '@/components/common/Typography';
import { LayerStatusBadge, LayerStatusCircle } from '@/components/LayerStatus';

import { useLayerStatus } from '../../hooks/selectors';
import { isRangeTimeInfo, isSingleTimeInfo, LayerMachineActor } from '../../machines/types';
import LayerDatePicker from './LayerDatePicker';
import LayerDateRangePicker from './LayerDateRangePicker';

export function LayerItem({
  layerActor,
  includeStatus = true,
}: {
  layerActor: LayerMachineActor;
  includeStatus?: boolean;
}) {
  const { layerName, opacity, timeInfo } = useSelector(layerActor, ({ context }) => ({
    layerName: context.layerName,
    opacity: context.opacity,
    timeInfo: context.timeInfo,
  }));

  const status = useLayerStatus(layerActor.id);
  const isEnabled = useSelector(layerActor, (state) => state.matches('enabled'));

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
        <Flex gap="2" w="full" alignItems="center" justifyContent="space-between">
          <Flex gap="2" grow={1} minW="0" alignItems="center">
            {includeStatus && <LayerStatusCircle status={status} />}
            <Typography
              className={css({
                overflow: 'hidden',
                wordBreak: 'break-all',
              })}
            >
              {layerName}
            </Typography>
          </Flex>
          {includeStatus && <LayerStatusBadge status={status} />}
        </Flex>
      </Checkbox>
      {isSingleTimeInfo(timeInfo) && (
        <LayerDatePicker
          isDisabled={!isEnabled}
          layerActor={layerActor}
          defaultValue={timeInfo.value ? fromDate(timeInfo.value, 'UTC') : undefined}
        />
      )}
      {isRangeTimeInfo(timeInfo) && (
        <LayerDateRangePicker
          isDisabled={!isEnabled}
          layerActor={layerActor}
          maxDate={today('UTC')}
          defaultValue={
            timeInfo.start
              ? { start: fromDate(timeInfo.start, 'UTC'), end: fromDate(timeInfo.end, 'UTC') }
              : undefined
          }
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
