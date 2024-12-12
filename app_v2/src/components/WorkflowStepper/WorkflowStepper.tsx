import { RecipeVariantProps, sva } from '@styled-system/css';
import { Circle } from '@styled-system/jsx';
import * as React from 'react';

import SvgIcon from '../common/SvgIcon';
import { Text, Title } from '../common/Typography';

const workFlowItemRecipe = sva({
  slots: ['root', 'itemWrapper', 'titleContainer', 'bullet'],
  base: {
    root: {
      display: 'flex',
      gap: '[var(--workflow-item-spacing)]',
      flexDirection: 'column',
      pl: '[calc(var(--bullet-size) * 1/2)]',
      '--bullet-size': '1.5rem',
      '--workflow-item-spacing': '2rem',
      '--item-content-padding-start': '2rem',
      '--line-width': '3px',
    },
    titleContainer: {
      w: 'full',
      mb: '3',
    },
    itemWrapper: {
      position: 'relative',

      pl: '[calc(var(--item-content-padding-start))]',
      '&:before': {
        position: 'absolute',
        top: '[calc(var(--bullet-size) )]',
        left: '[calc(var(--line-width) * -1/2)]',
        bottom: '[calc(var(--workflow-item-spacing) * -1)]',
        borderInlineStartWidth: '[var(--line-width)]',
        width: '1',
        content: '""',
        pointerEvents: 'none',
      },

      '&:last-child': {
        '&:before': {
          bottom: '0',
        },
      },
    },
    bullet: {
      display: 'flex',
      position: 'absolute',
      left: '[calc(var(--bullet-size) * -1/2)]',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 'full',
      w: '[var(--bullet-size)]',
      h: '[var(--bullet-size)]',
      bg: 'transparent',
    },
  },
  variants: {
    state: {
      completed: {
        bullet: {
          borderColor: 'fg.accent',
          borderWidth: 'unset',
          color: 'bg.base',
          bg: 'bg.accent',
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
          borderWidth: 'medium',
        },
        itemWrapper: {
          '&:before': {
            bgGradient: 'to-b',
            gradientFrom: 'app.accent',
            gradientTo: 'transparent',
            gradientToPosition: '4px',
            gradientFromPosition: '4px',
            backgroundRepeat: 'repeat-y',
            backgroundSize: '[var(--line-width) 8px]', // 4px dash + 4px space = 8px total
            borderStyle: 'none',
          },
        },
      },
      disabled: {
        bullet: {
          borderColor: 'fg.muted',
          borderWidth: 'medium',
        },
        itemWrapper: {
          '&:before': {
            bgGradient: 'to-b',
            gradientFrom: 'fg.muted',
            gradientTo: 'transparent',
            gradientToPosition: '4px',
            gradientFromPosition: '4px',
            backgroundRepeat: 'repeat-y',
            backgroundSize: '[var(--line-width) 8px]', // 4px dash + 4px space = 8px total
            borderStyle: 'none',
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

  const bulletIcon = {
    completed: <SvgIcon name="icon-check" size={16} />,
    active: <Circle size={'2.5'} bg={'fg.accent'} />,
    disabled: null,
    default: null,
  };

  return (
    <div className={itemWrapper}>
      <div className={bullet}>{bulletIcon[props.state ?? 'default']}</div>
      {title && (
        <div className={titleContainer}>
          <Title as="h3" bold size="md" margin={false}>
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
