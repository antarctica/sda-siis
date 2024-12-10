import { cva } from '@styled-system/css';

// Main field container styles
export const fieldRecipe = cva({
  base: {
    display: 'flex',
    gap: '1',
    flexDirection: 'column',
    mb: '2',
  },
});

// Label and helper text styles
export const labelRecipe = cva({
  base: {
    textStyle: 'label',
  },
});

export const validationErrorRecipe = cva({
  base: {
    textStyle: 'validationError',
    color: 'error.fg',
  },
});

// Border and container styles
export const fieldBorderRecipe = cva({
  base: {
    borderColor: 'bg.base.border',
    borderRadius: 'md',
    borderWidth: 'thin',
    borderStyle: 'solid',
  },
  variants: {
    isInvalid: {
      true: {
        borderColor: 'error.fg',
      },
    },
    isDisabled: {
      true: {
        borderColor: 'fg.muted',
      },
    },
  },
});

export const fieldGroupRecipe = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    borderColor: 'bg.base.border',
    borderWidth: 'thin',
    overflow: 'hidden',
  },
});

export const dateFieldGroupRecipe = cva({
  base: {
    gap: '1',
    justifyContent: 'space-between',
    w: 'full',
    minW: '52',
  },
});

export const inputContainerRecipe = cva({
  base: {
    h: '9',
    bg: 'app.grey.3',
  },
});

// Input element styles
export const inputRecipe = cva({
  base: {
    border: 'none',
    py: '1.5',
    px: '2',
    _placeholder: {
      textStyle: 'description',
      color: 'fg.muted',
    },
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

export const textAreaRecipe = cva({
  base: {
    py: '1.5',
    px: '2',
    bg: 'app.grey.3',
    _placeholder: {
      textStyle: 'description',
      color: 'fg.muted',
    },
  },
});
