import { defineUtility } from '@pandacss/dev';

export const insetFocusRing = defineUtility({
  className: 'inset-focus-ring',
  values: { type: 'boolean' },
  transform(value, { token }) {
    if (!value)
      return {
        outline: 'none',
      };
    return {
      outlineColor: token('colors.accent'),
      outlineWidth: 'thin',
      outlineOffset: '-2px',
      outlineStyle: 'solid',
    };
  },
});
