import { cva, cx, RecipeVariantProps, sva } from '@styled-system/css';
import { VisuallyHidden } from '@styled-system/jsx';
import {
  Checkbox as AriaCheckbox,
  CheckboxProps as AriaCheckBoxProps,
  composeRenderProps,
} from 'react-aria-components';

const checkboxRootRecipe = cva({
  base: {
    display: 'flex',
    gap: '2',
    alignItems: 'center',
    cursor: 'pointer',
  },
  variants: {
    isFocusVisible: {
      true: {
        insetFocusRing: true,
      },
      false: {
        insetFocusRing: false,
      },
    },
  },
});

const checkRecipe = sva({
  slots: ['box', 'check'],
  base: {
    box: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: 'fg.accent',
      borderWidth: 'thin',
      w: '4',
      minW: '4',
      h: '4',
      m: '2',
      borderStyle: 'dashed',
    },
    check: {
      display: 'none',
      w: '2.5',
      h: '2.5',
      bg: 'fg.accent',
    },
  },
  variants: {
    rounded: {
      true: {
        box: {
          rounded: 'full',
        },
        check: {
          rounded: 'full',
        },
      },
    },
    isSelected: {
      true: {
        check: {
          display: 'block',
        },
        box: {
          borderStyle: 'solid',
        },
      },
    },
    isHovered: {
      true: {
        check: {
          display: 'block',
          bg: 'bg.accent.soft',
        },
      },
    },
  },
  compoundVariants: [
    {
      isSelected: true,
      isHovered: true,
      css: {
        check: {
          w: '3',
          h: '3',
          bg: 'bg.accent',
        },
      },
    },
  ],
});

type CheckboxProps = AriaCheckBoxProps & RecipeVariantProps<typeof checkRecipe>;

export const Checkbox: React.FC<CheckboxProps> = ({ rounded, children, ...props }) => (
  <>
    <AriaCheckbox
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        cx('group', checkboxRootRecipe({ ...renderProps }), className),
      )}
      aria-label={props['aria-label']}
    >
      {({ isHovered, isSelected }) => {
        const { box, check } = checkRecipe({
          rounded,
          isSelected,
          isHovered,
        });
        return (
          <>
            <VisuallyHidden>{props['aria-label']}</VisuallyHidden>
            {children}
            <div className={cx(box, rounded ? 'rounded-full' : '')}>
              <span className={cx(check, rounded ? 'rounded-full' : '')} />
            </div>
          </>
        );
      }}
    </AriaCheckbox>
  </>
);

export default Checkbox;
