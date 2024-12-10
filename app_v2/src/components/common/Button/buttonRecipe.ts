import { cva } from '@styled-system/css';

export const buttonRecipe = cva({
  base: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 'thin',
    height: 'fit',
    textDecoration: 'none',
    cursor: 'pointer',
    borderStyle: 'solid',
  },
  variants: {
    variant: {
      primary: {
        borderColor: 'transparent',
        color: 'fg.accent.contrast',
        bg: 'app.accent',
        _disabled: {
          bg: 'app.accent.a7',
          _hover: {
            bg: 'app.accent.a7',
          },
        },
        _hover: {
          bg: 'app.accent.10',
        },
        _active: {
          filter: '[brightness(0.92) saturate(1.1)]',
        },
      },

      outline: {
        borderColor: 'app.accent',
        borderWidth: 'thin',
        borderStyle: 'solid',
        _hover: {
          bg: 'app.accent.a2',
        },
        _active: {
          bg: 'app.accent.a3',
        },
      },
      surface: {
        borderColor: 'transparent',
        _hover: {
          bg: 'siis_greyAlpha.a3',
          cursor: 'pointer',
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
    contained: {
      true: { w: 'full', h: 'full' },
    },
    isSelected: { true: {} },
    size: {
      sm: {
        gap: '1',
        borderRadius: 'xs',
        h: '6',
        py: '0.5',
        px: '1',
        fontSize: 'xs',
      },
      md: {
        gap: '2',
        borderRadius: 'sm',
        h: '8',
        p: '1.5',
        fontSize: 'md',
      },
      lg: {
        gap: '2',
        borderRadius: 'sm',
        h: '10',
        p: '2',
        fontSize: 'lg',
      },
    },
    isDisabled: {
      true: {
        color: 'app.grey.a10',
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
  compoundVariants: [
    {
      variant: ['outline'],
      isSelected: true,
      css: {
        bg: 'app.accent',
        color: 'fg.accent.contrast',
        _hover: {
          bg: 'app.accent.10',
        },
        _active: {
          filter: '[brightness(0.92) saturate(1.1)]',
        },
      },
    },
    {
      size: ['sm', 'md', 'lg'],
      contained: true,
      css: {
        h: 'full',
        w: 'full',
      },
    },
  ],
});
