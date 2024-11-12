import { cva } from '@styled-system/css';

export const fieldGroupRecipe = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 'thin',
    borderColor: 'bg.base.border',
  },
});

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

export const validationErrorRecipe = cva({
  base: {
    textStyle: 'validationError',
    color: 'error.fg',
  },
});

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

export const inputRecipe = cva({
  base: {
    h: '9',
    border: 'none',
    bg: 'app.grey.3',
    py: '1.5',
    px: '2',
    _placeholder: {
      textStyle: 'description',
      color: 'fg.muted',
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
