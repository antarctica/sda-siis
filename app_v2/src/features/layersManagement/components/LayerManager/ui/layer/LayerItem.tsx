import { fromDate, today } from '@internationalized/date';
import { css, sva } from '@styled-system/css';
import { Flex } from '@styled-system/jsx';
import { useSelector } from '@xstate/react';
import React from 'react';

import { IconButton } from '@/components/common/Button';
import { ToggleIconButton } from '@/components/common/Button/ToggleButton';
import Checkbox from '@/components/common/forms/Checkbox';
import Slider from '@/components/common/forms/Slider';
import SvgIcon from '@/components/common/SvgIcon';
import { Text } from '@/components/common/Typography';

import { LayerStatusBadge, LayerStatusCircle } from '../../../LayerStatus';
import { useLayerStatus } from '../../hooks/selectors';
import { isRangeTimeInfo, isSingleTimeInfo, LayerMachineActor } from '../../machines/types';
import LayerDatePicker from './LayerDatePicker';
import LayerDateRangePicker from './LayerDateRangePicker';

const layerItemRecipe = sva({
  slots: ['wrapper', 'layerToggle'],
  base: {
    wrapper: {
      display: 'flex',
      gap: '2',

      flexDirection: 'column',
      borderRadius: 'sm',
      px: '2',
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
        wrapper: {
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
  removeLayer,
}: {
  layerActor: LayerMachineActor;
  includeStatus?: boolean;
  inGroup?: boolean;
  removeLayer?: () => void;
}) {
  const [showProperties, setShowProperties] = React.useState(false);
  const { layerName, opacity, timeInfo } = useSelector(layerActor, ({ context }) => ({
    layerName: context.layerName,
    opacity: context.opacity,
    timeInfo: context.timeInfo,
  }));
  const status = useLayerStatus(layerActor.id);
  const isEnabled = useSelector(layerActor, (state) => state.matches('enabled'));

  const { wrapper, layerToggle } = layerItemRecipe({ isEnabled, inGroup });

  return (
    <li className={wrapper}>
      <Flex className={layerToggle} gap="2" alignItems="center" w="full">
        {removeLayer && (
          <IconButton
            size="sm"
            variant="outline"
            icon={<SvgIcon name={'icon-subtract'} size={14} />}
            aria-label="Remove layer"
            onPress={() => {
              removeLayer();
            }}
          />
        )}
        <Checkbox
          className={css({
            display: 'flex',
            flexGrow: 1,

            justifyContent: 'space-between',
          })}
          onChange={() => {
            layerActor.send({
              type: isEnabled ? 'LAYER.DISABLED' : 'LAYER.ENABLED',
            });
          }}
          isSelected={isEnabled}
        >
          <Flex gap="2" justifyContent="space-between" alignItems="center" w="full">
            <Flex gap="2" grow={1} alignItems="center" minW="0">
              {includeStatus && <LayerStatusCircle status={status} />}
              <Text
                className={css({
                  overflow: 'hidden',
                })}
              >
                {layerName}
              </Text>
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
        <Flex flexDirection="column" w="full">
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
