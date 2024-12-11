'use client';

import { cx } from '@styled-system/css';
import { ButtonVariantProps } from '@styled-system/recipes';
import { button } from '@styled-system/recipes/button.mjs';
import React from 'react';
import {
  Button as ButtonPrimitive,
  composeRenderProps,
  TooltipTrigger,
} from 'react-aria-components';

import Tooltip from '../Tooltip';

export type IconButtonProps = React.ComponentProps<typeof ButtonPrimitive> &
  ButtonVariantProps & {
    className?: string;
  } & {
    icon: React.ReactNode;
    'aria-label': string;
    disableTooltip?: boolean;
    tooltipPlacement?: 'top' | 'right' | 'bottom' | 'left';
  };

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function Button(
  { icon: Icon, className, disableTooltip, tooltipPlacement, ...restProps }: IconButtonProps,
  ref,
) {
  return (
    <TooltipTrigger delay={800}>
      <ButtonPrimitive
        ref={ref}
        className={composeRenderProps(className, (className, renderProps) => {
          const [recipeProps] = button.splitVariantProps({ ...restProps, ...renderProps });
          return cx(button(recipeProps), className);
        })}
        {...restProps}
      >
        {Icon}
      </ButtonPrimitive>
      {!disableTooltip && (
        <Tooltip placement={tooltipPlacement ?? 'right'}>{restProps['aria-label']}</Tooltip>
      )}
    </TooltipTrigger>
  );
});
