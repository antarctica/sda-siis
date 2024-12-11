'use client';

import { cx } from '@styled-system/css';
import { ButtonVariantProps } from '@styled-system/recipes';
import { button } from '@styled-system/recipes/button.mjs';
import React from 'react';
import { Button as ButtonPrimitive, composeRenderProps } from 'react-aria-components';

type ButtonProps = React.ComponentProps<typeof ButtonPrimitive> &
  ButtonVariantProps & {
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
        const [recipeProps] = button.splitVariantProps({ ...restProps, ...renderProps });
        return cx(button(recipeProps), className);
      })}
      {...restProps}
    >
      {children}
    </ButtonPrimitive>
  );
});
