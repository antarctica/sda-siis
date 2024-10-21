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
        animationName: 'fadeIn',
        animationDuration: '100ms',
        animationFillMode: 'forwards',
        animationTimingFunction: 'ease-out',
      },

      '&[data-exiting]': {
        opacity: 0,
        animationName: 'fadeOut',
        animationDuration: '100ms',
        animationFillMode: 'forwards',
        animationTimingFunction: 'ease-out',
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
        borderColor: 'fg.accent',
      },
      _light: { bg: 'siis_purple', borderColor: 'fg.accent', color: 'app.white', shadow: 'sm' },

      '[data-placement="top"] &': {
        animationName: 'slideInBottom',
        animationDuration: '50ms',
        animationFillMode: 'forwards',
        animationTimingFunction: 'ease-out',
      },
      '[data-placement="right"] &': {
        animationName: 'slideInLeft',
        animationDuration: '50ms',
        animationFillMode: 'forwards',
        animationTimingFunction: 'ease-out',
      },
      '[data-placement="bottom"] &': {
        animationName: 'slideInTop',
        animationDuration: '50ms',
        animationFillMode: 'forwards',
        animationTimingFunction: 'ease-out',
      },
      '[data-placement="left"] &': {
        animationName: 'slideInRight',
        animationDuration: '50ms',
        animationFillMode: 'forwards',
        animationTimingFunction: 'ease-out',
      },
    },
    arrow: {
      '[data-placement=top] &': {
        transform: 'rotate(180deg)',
      },
      '[data-placement="right"] &': {
        transform: 'rotate(-90deg) translate(0, 5px)',
      },
      '[data-placement="bottom"] &': {
        transform: 'rotate(0deg)',
      },
      '[data-placement="left"] &': {
        transform: 'rotate(90deg) translate(0, 5px)',
      },
      _light: { fill: 'siis_purple' },
      _dark: { fill: 'fg.accent' },
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
      <div className={container}>
        <OverlayArrow>
          <svg className={arrow} width="16" height="6" xmlns="http://www.w3.org/2000/svg">
            <path
              className={css({
                _light: {
                  filter: '[drop-shadow( 0 1px 2px rgb(0 0 0 / 0.1))]',
                },
              })}
              d="M0 6s1.796-.013 4.67-3.615C5.851.9 6.93.006 8 0c1.07-.006 2.148.887 3.343 2.385C14.233 6.005 16 6 16 6H0z"
            ></path>
          </svg>
        </OverlayArrow>
        {children}
      </div>
    </AriaTooltip>
  );
}
export default Tooltip;
