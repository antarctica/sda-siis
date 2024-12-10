import { cx, RecipeVariantProps, sva } from '@styled-system/css';
import React from 'react';
import {
  Button as ButtonPrimitive,
  composeRenderProps,
  TooltipTrigger,
} from 'react-aria-components';

import Tooltip from '@/components/common/Tooltip';

const sidebarButtonRecipe = sva({
  slots: ['root', 'icon', 'title'],

  base: {
    root: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      width: 'full',
      textWrap: 'nowrap',
      bg: 'bg.sidebar',
      _hover: {
        bg: 'bg.sidebar.hover',
      },
      _active: {
        bg: 'bg.sidebar.active',
      },
    },
    icon: {
      display: 'inline-flex',
      flexShrink: 0,
      justifyContent: 'center',
      alignItems: 'center',
      width: '[var(--sidebar-collapsed-width, 48px)]',
      height: '[var(--sidebar-collapsed-width, 48px)]',
    },
    title: {
      textStyle: 'body',
      fontWeight: 'normal',
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
          color: 'fg.accent',
          bg: 'bg.sidebar.active',
          _hover: {
            bg: 'bg.sidebar.active',
          },
        },
        icon: {},
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
