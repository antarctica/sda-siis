import { fromDate, today } from '@internationalized/date';
import { css, sva } from '@styled-system/css';
import { Flex } from '@styled-system/jsx';
import { useSelector } from '@xstate/react';
import React from 'react';

import { ToggleIconButton } from '@/components/common/Button/ToggleButton';
import Checkbox from '@/components/common/forms/Checkbox';
import Slider from '@/components/common/forms/Slider';
import SvgIcon from '@/components/common/SvgIcon';
// import Slider from '@/components/common/forms/Slider';
import Typography from '@/components/common/Typography';
import { LayerStatusBadge, LayerStatusCircle } from '@/components/LayerStatus';

import { useLayerStatus } from '../../hooks/selectors';
import { isRangeTimeInfo, isSingleTimeInfo, LayerMachineActor } from '../../machines/types';
import LayerDatePicker from './LayerDatePicker';
import LayerDateRangePicker from './LayerDateRangePicker';

const layerItemRecipe = sva({
  slots: ['wrapper', 'layerToggle'],
  base: {
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2',

      borderRadius: 'sm',
      px: '2',
      pb: '2',
    },
  },
  variants: {
    isEnabled: {
      true: {
        wrapper: {
          bg: 'bg.surface.accent',
        },
      },
      false: {
        wrapper: {
          bg: 'bg.surface',
        },
      },
    },
    inGroup: {
      true: {
        wrapper: {
          bg: 'bg.surface.accent',
        },
      },
    },
  },
  compoundVariants: [
    {
      isEnabled: false,
      inGroup: true,
      css: {
        layerToggle: {
          bg: 'transparent',
        },
      },
    },
  ],
});

export function LayerItem({
  layerActor,
  includeStatus = true,
  inGroup = false,
}: {
  layerActor: LayerMachineActor;
  includeStatus?: boolean;
  inGroup?: boolean;
}) {
  const [showProperties, setShowProperties] = React.useState(false);
  const { layerName, opacity, timeInfo } = useSelector(layerActor, ({ context }) => ({
    layerName: context.layerName,
    opacity: context.opacity,
    timeInfo: context.timeInfo,
  }));
  console.log(opacity);
  const status = useLayerStatus(layerActor.id);
  const isEnabled = useSelector(layerActor, (state) => state.matches('enabled'));

  const { wrapper, layerToggle } = layerItemRecipe({ isEnabled, inGroup });

  return (
    <li className={wrapper}>
      <Flex w="full" alignItems="center" gap="2" className={layerToggle}>
        <Checkbox
          onChange={() => {
            layerActor.send({
              type: isEnabled ? 'LAYER.DISABLED' : 'LAYER.ENABLED',
            });
          }}
          isSelected={isEnabled}
          className={css({
            display: 'flex',
            flexGrow: 1,

            justifyContent: 'space-between',
          })}
        >
          <Flex gap="2" w="full" alignItems="center" justifyContent="space-between">
            <Flex gap="2" grow={1} minW="0" alignItems="center">
              {includeStatus && <LayerStatusCircle status={status} />}
              <Typography
                className={css({
                  overflow: 'hidden',
                })}
              >
                {layerName}
              </Typography>
            </Flex>
            {includeStatus && <LayerStatusBadge status={status} />}
          </Flex>
        </Checkbox>
        <ToggleIconButton
          size="sm"
          icon={<SvgIcon name={'icon-properties'} size={14} />}
          aria-label="Properties"
          isSelected={showProperties}
          onPress={() => {
            setShowProperties(!showProperties);
          }}
        ></ToggleIconButton>
      </Flex>
      {isSingleTimeInfo(timeInfo) && isEnabled && (
        <LayerDatePicker
          isDisabled={!isEnabled}
          layerActor={layerActor}
          defaultValue={timeInfo.value ? fromDate(timeInfo.value, 'UTC') : undefined}
        />
      )}
      {isRangeTimeInfo(timeInfo) && isEnabled && (
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
      {showProperties && (
        <Flex w="full" flexDirection="column">
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
        </Flex>
      )}
    </li>
  );
}
