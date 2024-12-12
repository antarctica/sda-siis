'use client';

import { cx } from '@styled-system/css';
import { ButtonVariantProps } from '@styled-system/recipes';
import { button } from '@styled-system/recipes/button.mjs';
import React from 'react';
import { composeRenderProps, Link as LinkPrimitive, LinkProps } from 'react-aria-components';

export type LinkButtonProps = LinkProps &
  ButtonVariantProps & {
    className?: string;
  };

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(function Link(
  { className, children, ...restProps }: LinkButtonProps,
  ref,
) {
  return (
    <LinkPrimitive
      ref={ref}
      className={composeRenderProps(className, (className, renderProps) => {
        const [recipeProps] = button.splitVariantProps({ ...restProps, ...renderProps });

        return cx(button(recipeProps), className);
      })}
      {...restProps}
    >
      {children}
    </LinkPrimitive>
  );
});
