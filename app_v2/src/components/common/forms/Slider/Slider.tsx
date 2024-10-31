import { cva, cx, sva } from '@styled-system/css';
import {
  composeRenderProps,
  Slider as AriaSlider,
  SliderOutput,
  SliderProps as AriaSliderProps,
  SliderThumb,
  SliderTrack,
} from 'react-aria-components';

import { Label } from '../Field';

const sliderRecipe = sva({
  slots: ['root', 'label', 'output', 'interaction-container'],
  base: {
    root: {
      gap: '1',
      _horizontal: {
        display: 'grid',
        gridTemplateColumns: '[1fr auto]',
      },
    },
    'interaction-container': {
      _horizontal: {
        gridColumn: '2',
        alignItems: 'center',
        position: 'relative',
        mx: '2',
        h: '6',
      },
    },
  },
});

const trackRecipe = cva({
  base: {
    rounded: 'sm',
    position: 'absolute',
    top: '[50%]',
    transform: 'translateY(-50%)',
    w: 'full',
    h: '0.5',
    cursor: 'pointer',
  },
  variants: {
    filled: {
      true: {
        bg: 'bg.accent',
      },
      false: {
        bg: 'bg.accent.soft',
      },
    },
    isDisabled: {
      false: {},
      true: { cursor: 'not-allowed' },
    },
  },
  compoundVariants: [
    {
      isDisabled: true,
      filled: false,
      css: {
        bg: 'app.grey.5',
      },
    },
    {
      isDisabled: true,
      filled: true,
      css: {
        bg: 'app.grey.8',
      },
    },
  ],
});

const thumbRecipe = cva({
  base: {
    w: '1',
    h: '6',
    rounded: 'full',
    bg: 'bg.base',
    borderColor: 'bg.accent',
    borderWidth: 'medium',
    top: '[50%]',
    transform: 'translateY(-50%)',
    cursor: 'ew-resize',
    _focusVisible: {
      insetFocusRing: true,
      outlineOffset: '0.5',
    },
  },
  variants: {
    isDragging: {
      true: { bg: 'bg.accent.soft', cursor: 'ew-resize' },
    },
    isDisabled: {
      true: { cursor: 'not-allowed', borderColor: 'app.grey.8' },
    },
  },
});

export interface SliderProps<T> extends AriaSliderProps<T> {
  label?: string;
  thumbLabels?: string[];
}

export default function Slider<T extends number | number[]>({
  label,
  thumbLabels,
  ...props
}: SliderProps<T>) {
  const { root, 'interaction-container': interactionContainer } = sliderRecipe();
  return (
    <AriaSlider
      {...props}
      className={composeRenderProps(props.className, (className) => cx('group', root, className))}
    >
      <Label>{label}</Label>
      <SliderOutput>
        {({ state }) => state.values.map((_, i) => state.getThumbValueLabel(i)).join(' – ')}
      </SliderOutput>
      <SliderTrack className={interactionContainer}>
        {({ state, ...renderProps }) => (
          <>
            {/* Track */}
            <div className={trackRecipe({ filled: false, ...renderProps })} />
            {/* Fill */}
            <div
              className={trackRecipe({ filled: true, ...renderProps })}
              style={{ width: `${state.getThumbPercent(0) * 100}%` }}
            />
            {/* Thumbs */}
            {state.values.map((_, i) => (
              <SliderThumb
                key={i}
                index={i}
                aria-label={thumbLabels?.[i]}
                className={thumbRecipe({ isDragging: state.isThumbDragging(i), ...renderProps })}
              />
            ))}
          </>
        )}
      </SliderTrack>
    </AriaSlider>
  );
}
