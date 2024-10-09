import { sva } from '@styled-system/css';
import React from 'react';
import {
  OverlayArrow,
  Tooltip as AriaTooltip,
  TooltipProps as AriaTooltipProps,
} from 'react-aria-components';

export interface TooltipProps extends Omit<AriaTooltipProps, 'children' | 'placement'> {
  children: React.ReactNode;
  placement: 'top' | 'right' | 'bottom' | 'left';
}

const tooltipRecipe = sva({
  slots: ['root', 'arrow'],
  base: {
    root: {
      fontSize: 'sm',
      bg: 'bg.base',
      py: '0.5',
      px: '2',
      borderWidth: 'thin',
      borderColor: 'bg.base.border',
      borderRadius: 'sm',
      _light: {
        shadow: 'sm',
      },
    },
    arrow: {
      fill: 'siis_grey.10',
      _dark: {
        fill: 'siis_darkgrey.6',
      },
    },
  },
  variants: {
    placement: {
      top: {
        arrow: {
          transform: 'rotate(180deg)',
        },
      },
      right: {
        arrow: {
          transform: 'rotate(90deg)',
        },
      },
      bottom: {
        arrow: {
          transform: 'rotate(0deg)',
        },
      },
      left: {
        arrow: {
          transform: 'rotate(-90deg)',
        },
      },
    },
  },
});

export function Tooltip({ children, ...props }: TooltipProps) {
  const { root, arrow } = tooltipRecipe(props);

  return (
    <AriaTooltip {...props} offset={10} className={root}>
      <OverlayArrow>
        <svg width={8} height={8} viewBox="0 0 8 8" className={arrow}>
          <path d="M0 0 L4 4 L8 0" />
        </svg>
      </OverlayArrow>
      {children}
    </AriaTooltip>
  );
}
export default Tooltip;
