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
        animationName: '[fadeIn]',
        animationDuration: '[100ms]',
        animationFillMode: '[forwards]',
        animationTimingFunction: '[ease-out]',
      },

      '&[data-exiting]': {
        opacity: 0,
        animationName: '[fadeOut]',
        animationDuration: '[100ms]',
        animationFillMode: '[forwards]',
        animationTimingFunction: '[ease-out]',
      },
    },
    container: {
      position: 'relative',
      fontSize: 'sm',
      py: '1',
      px: '2',
      borderRadius: 'sm',
      borderWidth: 'thin',
      _dark: {
        bg: 'bg.base',
        color: 'fg',
        borderColor: 'app.accent',
      },
      _light: { bg: 'app.accent', borderColor: 'app.accent', color: 'app.white', shadow: 'sm' },

      '[data-placement="top"] &': {
        animationName: '[slideInBottom]',
        animationDuration: '[50ms]',
        animationFillMode: 'forwards',
        animationTimingFunction: '[ease-out]',
      },
      '[data-placement="right"] &': {
        animationName: '[slideInLeft]',
        animationDuration: '[50ms]',
        animationFillMode: 'forwards',
        animationTimingFunction: '[ease-out]',
      },
      '[data-placement="bottom"] &': {
        animationName: '[slideInTop]',
        animationDuration: '[50ms]',
        animationFillMode: '[forwards]',
        animationTimingFunction: '[ease-out]',
      },
      '[data-placement="left"] &': {
        animationName: '[slideInRight]',
        animationDuration: '[50ms]',
        animationFillMode: '[forwards]',
        animationTimingFunction: '[ease-out]',
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
    <AriaTooltip {...props} offset={10} className={root}>
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
              stroke: 'fg.accent',
              strokeWidth: '1px',
              _light: { display: 'none' },
            })}
          />
        </svg>
      </OverlayArrow>
    </AriaTooltip>
  );
}
export default Tooltip;
