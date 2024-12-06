import { RecipeVariantProps, sva } from '@styled-system/css';
import * as React from 'react';

import { Text, Title } from '../common/Typography';

const workFlowItemRecipe = sva({
  slots: ['root', 'itemWrapper', 'titleContainer', 'bullet'],
  base: {
    root: {
      '--bullet-size': '1.5rem',
      '--workflow-item-spacing': '2rem',
      '--item-content-padding-start': '2rem',
      '--line-width': '2px',
      pl: '[calc(var(--bullet-size) * 1/2)]',
      display: 'flex',
      flexDirection: 'column',
      gap: '[var(--workflow-item-spacing)]',
    },
    titleContainer: {
      mb: '3',
      w: 'full',
    },
    itemWrapper: {
      pl: '[calc(var(--item-content-padding-start))]',
      position: 'relative',

      '&:before': {
        content: '""',
        pointerEvents: 'none',
        position: 'absolute',
        top: '[calc(var(--bullet-size) )]',
        left: '[calc(var(--line-width) * -1/2)]',
        bottom: '[calc(var(--workflow-item-spacing) * -1)]',
        width: '1',
        borderInlineStartWidth: '[var(--line-width)]',
      },

      '&:last-child': {
        '&:before': {
          bottom: '0',
        },
      },
    },
    bullet: {
      borderRadius: 'full',
      position: 'absolute',
      left: '[calc(var(--bullet-size) * -1/2)]',
      w: '[var(--bullet-size)]',
      h: '[var(--bullet-size)]',
      borderWidth: 'thick',
      bg: 'transparent',
    },
  },
  variants: {
    state: {
      completed: {
        bullet: {
          borderColor: 'fg.accent',
          bg: 'bg.accent.soft',
        },
        itemWrapper: {
          '&:before': {
            borderColor: 'fg.accent',
          },
        },
      },
      active: {
        bullet: {
          borderColor: 'fg.accent',
          bg: 'bg.accent.soft',
        },
        itemWrapper: {
          '&:before': {
            borderColor: 'fg.muted',
          },
        },
      },
      disabled: {
        bullet: {
          borderColor: 'fg.muted',
        },
        itemWrapper: {
          '&:before': {
            borderColor: 'fg.muted',
          },
        },
      },
    },
  },
  defaultVariants: {
    state: 'disabled',
  },
});

type WorkflowItemProps = RecipeVariantProps<typeof workFlowItemRecipe> & {
  title?: string;
  description?: string;
};

export function WorkflowItem({
  children,
  title,
  description,
  ...props
}: React.PropsWithChildren<WorkflowItemProps>) {
  const { itemWrapper, bullet, titleContainer } = workFlowItemRecipe(props);
  return (
    <div className={itemWrapper}>
      <div className={bullet} />
      {title && (
        <div className={titleContainer}>
          <Title bold as="h3" size="md" margin={false}>
            {title}
          </Title>
          {description && <Text textStyle="description">{description}</Text>}
        </div>
      )}
      {children}
    </div>
  );
}

function WorkflowStepper({
  children,
  style,
}: React.PropsWithChildren<{ style?: React.CSSProperties }>) {
  const { root } = workFlowItemRecipe();
  return (
    <div className={root} style={style}>
      {children}
    </div>
  );
}

export default WorkflowStepper;
