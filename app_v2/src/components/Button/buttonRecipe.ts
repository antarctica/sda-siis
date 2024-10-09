import { cva } from '@styled-system/css';

export const buttonRecipe = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  variants: {
    variant: {
      surface: {
        border: 'none',
        _hover: {
          cursor: 'pointer',
          bg: '[black/8]',
          _dark: {
            bg: '[white/10]',
          },
        },
        _active: {
          bg: '[black/12]',
          _dark: {
            bg: '[white/12]',
          },
        },
      },
    },
    size: {
      sm: {
        fontSize: 'sm',
        p: '1',
        gap: '1',
      },
      md: {
        fontSize: 'md',
        p: '2',
        gap: '2',
      },
      lg: {
        fontSize: 'lg',
        p: '2.5',
        gap: '2',
      },
    },
    isDisabled: {
      true: {
        color: 'bas_grayscale.400',
        _hover: {
          cursor: 'not-allowed',
        },
      },
    },
    isFocusVisible: {
      true: {
        insetFocusRing: true,
      },
      false: {
        insetFocusRing: false,
      },
    },
    IconButton: {
      true: {
        p: '0',
      },
    },
  },

  defaultVariants: {
    size: 'lg',
  },
});
