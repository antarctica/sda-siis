import { css, sva } from '@styled-system/css';
import React from 'react';
import {
  OverlayArrow,
  Tooltip as AriaTooltip,
  TooltipProps as AriaTooltipProps,
} from 'react-aria-components';

import useIsMobile from '@/hooks/useIsMobile';

export interface TooltipProps extends Omit<AriaTooltipProps, 'children'> {
  children: React.ReactNode;
}

const tooltipRecipe = sva({
  className: 'tooltip',
  slots: ['root', 'arrow', 'container'],
  base: {
    root: {
      '&[data-entering]': {
        opacity: 0,
        _motionSafe: {
          animationName: 'fadeIn',
          animationDuration: 'faster',
          animationFillMode: 'forwards',
          animationTimingFunction: 'out',
        },
      },

      '&[data-exiting]': {
        opacity: 0,
        _motionSafe: {
          animationName: 'fadeOut',
          animationDuration: 'faster',
          animationFillMode: 'forwards',
          animationTimingFunction: 'out',
        },
      },
    },
    container: {
      position: 'relative',
      borderRadius: 'sm',
      borderWidth: 'thin',
      py: '1',
      px: '2',
      fontSize: 'sm',
      _dark: {
        borderColor: 'app.accent',
        color: 'fg',
        bg: 'bg.base',
      },
      _light: { borderColor: 'app.accent', color: 'app.white', bg: 'app.accent', shadow: 'sm' },

      '[data-placement="top"] &': {
        _motionSafe: {
          animationName: 'slideInBottom',
          animationDuration: 'fastest',
          animationFillMode: 'forwards',
          animationTimingFunction: 'out',
        },
      },
      '[data-placement="right"] &': {
        _motionSafe: {
          animationName: 'slideInLeft',
          animationDuration: 'fastest',
          animationFillMode: 'forwards',
          animationTimingFunction: 'out',
        },
      },
      '[data-placement="bottom"] &': {
        _motionSafe: {
          animationName: 'slideInTop',
          animationDuration: 'fastest',
          animationFillMode: 'forwards',
          animationTimingFunction: 'out',
        },
      },
      '[data-placement="left"] &': {
        _motionSafe: {
          animationName: 'slideInRight',
          animationDuration: 'fastest',
          animationFillMode: 'forwards',
          animationTimingFunction: 'out',
        },
      },
    },
    arrow: {
      '[data-placement=top] &': {
        transform: 'rotate(0deg) translate(0, -1px)',
      },
      '[data-placement="right"] &': {
        transform: 'rotate(90deg) translate(0, -1px)',
      },
      '[data-placement="bottom"] &': {
        transform: 'rotate(180deg) translate(0, -1px)',
      },
      '[data-placement="left"] &': {
        transform: 'rotate(-90deg) translate(0, -1px)',
      },
    },
  },
});

export function Tooltip({ children, ...props }: TooltipProps) {
  const { root, arrow, container } = tooltipRecipe();
  const isMobile = useIsMobile();
  if (isMobile) {
    return null;
  }
  return (
    <AriaTooltip {...props} className={root} offset={10}>
      <div className={container}>{children}</div>{' '}
      <OverlayArrow style={{ zIndex: 1000 }}>
        <svg className={arrow} width={12} height={12} viewBox="0 0 8 8">
          {/* Background triangle */}
          <path
            d="M0 0 L4 4 L8 0 Z"
            className={css({
              fill: 'app.accent',
              _dark: { fill: 'bg.base' },
            })}
          />
          {/* Angled sides only */}
          <path
            d="M0 0 L4 4 M4 4 L8 0"
            className={css({
              strokeWidth: '1px',
              stroke: 'fg.accent',
              _light: { display: 'none' },
            })}
          />
        </svg>
      </OverlayArrow>
    </AriaTooltip>
  );
}
export default Tooltip;
