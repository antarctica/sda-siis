import { RecipeVariantProps, sva } from '@styled-system/css';
import { Circle } from '@styled-system/jsx';
import * as React from 'react';

import SvgIcon from '../common/SvgIcon';
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
      bg: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  variants: {
    state: {
      completed: {
        bullet: {
          borderColor: 'fg.accent',
          bg: 'bg.accent',
          color: 'app.white',
          borderWidth: 'unset',
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
            backgroundSize: '[var(--line-width) 8px]', // 4px dash + 4px space = 8px total
            borderStyle: 'none',
            backgroundRepeat: 'repeat-y',
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
            backgroundSize: '[var(--line-width) 8px]', // 4px dash + 4px space = 8px total
            borderStyle: 'none',
            backgroundRepeat: 'repeat-y',
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
