import { cva } from '@styled-system/css';

// Main field container styles
export const fieldRecipe = cva({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1',
    mb: '2',
  },
});

// Label and helper text styles
export const labelRecipe = cva({
  base: {
    textStyle: 'label',
  },
});

export const descriptionRecipe = cva({
  base: {
    textStyle: 'description',
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
    borderRadius: 'md',
    borderWidth: 'thin',
    borderColor: 'bg.base.border',
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
    overflow: 'hidden',
    borderWidth: 'thin',
    borderColor: 'bg.base.border',
  },
});

export const dateFieldGroupRecipe = cva({
  base: {
    minW: '52',
    w: 'full',
    justifyContent: 'space-between',
    pr: '0.5',
    gap: '1',
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
    bg: 'app.grey.3',
    py: '1.5',
    px: '2',
    _placeholder: {
      textStyle: 'description',
      color: 'fg.muted',
    },
  },
});
