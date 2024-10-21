/* eslint-disable @pandacss/no-hardcoded-color */
import { cva } from '@styled-system/css';

export const buttonRecipe = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
    height: 'fit',
  },
  variants: {
    variant: {
      surface: {
        border: 'none',
        _hover: {
          cursor: 'pointer',
          bg: 'siis_greyAlpha.a3',
          _dark: {
            bg: 'siis_darkgreyAlpha.a3',
          },
        },
        _active: {
          bg: 'siis_greyAlpha.a4',
          _dark: {
            bg: 'siis_darkgreyAlpha.a4',
          },
        },
      },
      mapButton: {
        bg: 'bg.base',
        _hover: {
          bg: 'siis_grey.3',
          _dark: {
            bg: 'siis_darkgrey.3',
          },
        },
        _active: {
          bg: 'siis_grey.4',
          _dark: {
            bg: 'siis_darkgrey.4',
          },
        },
      },
    },
    size: {
      sm: {
        fontSize: 'xs',
        py: '0.5',
        px: '1',
        gap: '1',
        borderRadius: 'xs',
      },
      md: {
        fontSize: 'md',
        p: '1.5',
        gap: '2',
        borderRadius: 'sm',
      },
      lg: {
        fontSize: 'lg',
        p: '2',
        gap: '2',
        borderRadius: 'sm',
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
