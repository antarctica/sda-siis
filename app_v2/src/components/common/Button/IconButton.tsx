'use client';

import { cx, RecipeVariantProps } from '@styled-system/css';
import React from 'react';
import {
  Button as ButtonPrimitive,
  composeRenderProps,
  TooltipTrigger,
} from 'react-aria-components';

import Tooltip from '../Tooltip';
import { buttonRecipe } from './buttonRecipe';

export type IconButtonProps = React.ComponentProps<typeof ButtonPrimitive> &
  RecipeVariantProps<typeof buttonRecipe> & {
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
          const [recipeProps] = buttonRecipe.splitVariantProps({ ...restProps, ...renderProps });
          return cx(buttonRecipe(recipeProps), className);
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
