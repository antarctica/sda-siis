import { cx, RecipeVariantProps, sva } from '@styled-system/css';
import React from 'react';
import {
  Button as ButtonPrimitive,
  composeRenderProps,
  TooltipTrigger,
} from 'react-aria-components';

import Tooltip from '../../Tooltip';

const sidebarButtonRecipe = sva({
  slots: ['root', 'icon', 'title'],

  base: {
    root: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      textWrap: 'nowrap',
      width: 'full',
      _hover: {
        bg: 'bg.base.hover',
      },
      _active: {
        bg: 'bg.base.active',
      },
    },
    icon: {
      display: 'inline-flex',
      width: '[var(--sidebar-collapsed-width, 48px)]',
      height: '[var(--sidebar-collapsed-width, 48px)]',
      flexShrink: 0,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0.8,
    },
    title: {
      textStyle: 'body',
      fontWeight: 'medium',
    },
  },

  variants: {
    isFocusVisible: {
      true: {
        root: {
          insetFocusRing: true,
        },
      },
      false: {
        root: {
          insetFocusRing: false,
        },
      },
    },
    isDisabled: {
      true: {
        root: {
          opacity: '0.5',
          cursor: 'not-allowed',
        },
      },
      false: {
        root: {
          cursor: 'pointer',
        },
      },
    },
    active: {
      true: {
        root: {
          bg: 'bg.base.active',
          _hover: {
            bg: 'bg.base.active',
          },
          _active: {
            bg: 'bg.base',
          },
        },
        icon: {
          opacity: 1,
        },
      },
    },
  },
});

type ButtonProps = React.ComponentProps<typeof ButtonPrimitive> &
  RecipeVariantProps<typeof sidebarButtonRecipe> & {
    className?: string;
    active: boolean;
    title: string;
    collapsed: boolean;
    icon: React.ReactNode;
  };

export const SidebarButton = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, isDisabled, active, icon, title, collapsed, ...restProps }: ButtonProps,
  ref,
) {
  return (
    <TooltipTrigger delay={800}>
      <ButtonPrimitive
        ref={ref}
        className={composeRenderProps(className, (className, renderProps) =>
          cx(sidebarButtonRecipe({ ...renderProps, active }).root, className),
        )}
        isDisabled={isDisabled}
        {...restProps}
      >
        {(renderProps) => {
          const { icon: iconClass, title: titleClass } = sidebarButtonRecipe({
            ...renderProps,
            active,
          });

          return (
            <>
              <span className={iconClass}>{icon}</span>
              <span className={titleClass}>{title}</span>
            </>
          );
        }}
      </ButtonPrimitive>
      {collapsed && <Tooltip placement={'right'}>{title}</Tooltip>}
    </TooltipTrigger>
  );
});
