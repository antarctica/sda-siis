'use client';

import { cx, RecipeVariantProps } from '@styled-system/css';
import React from 'react';
import {
  Button as ButtonPrimitive,
  composeRenderProps,
  Link as LinkPrimitive,
} from 'react-aria-components';

import { buttonRecipe } from './buttonRecipe';

type ButtonProps = React.ComponentProps<typeof ButtonPrimitive> &
  RecipeVariantProps<typeof buttonRecipe> & {
    className?: string;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, children, ...restProps }: ButtonProps,
  ref,
) {
  return (
    <ButtonPrimitive
      ref={ref}
      className={composeRenderProps(className, (className, renderProps) => {
        const [recipeProps] = buttonRecipe.splitVariantProps({ ...restProps, ...renderProps });
        return cx(buttonRecipe(recipeProps), className);
      })}
      {...restProps}
    >
      {children}
    </ButtonPrimitive>
  );
});

type LinkProps = React.ComponentProps<typeof LinkPrimitive> &
  RecipeVariantProps<typeof buttonRecipe> & {
    className?: string;
  };

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { className, children, ...restProps }: LinkProps,
  ref,
) {
  return (
    <LinkPrimitive
      ref={ref}
      className={composeRenderProps(className, (className, renderProps) => {
        const [recipeProps] = buttonRecipe.splitVariantProps({ ...restProps, ...renderProps });

        return cx(buttonRecipe(recipeProps), className);
      })}
      {...restProps}
    >
      {children}
    </LinkPrimitive>
  );
});
