import { cva, RecipeVariantProps } from '@styled-system/css';

export const textLineBarRecipe = cva({
  base: {},
  variants: {
    lineBarPosition: {
      start: {
        gridTemplateColumns: '[ auto 1fr]',
        '&::after': {
          display: 'block',
          width: 'full',
          height: '0.5',
          backgroundColor: 'bg.base.border',
          content: "''",
        },
      },
      middle: {
        gridTemplateColumns: '[1fr auto 1fr]',
        '&::before, &::after': {
          display: 'block',
          width: 'full',
          height: '0.5',
          backgroundColor: 'bg.base.border',
          content: "''",
        },
      },
      end: {
        gridTemplateColumns: '[1fr auto]',
        '&::before': {
          display: 'block',
          width: 'full',
          height: '[1px]',
          backgroundColor: 'bg.base.border',
          content: "''",
        },
      },
    },
  },
  compoundVariants: [
    {
      lineBarPosition: ['start', 'middle', 'end'],
      css: {
        display: 'grid',
        gridGap: '2',
        alignItems: 'center',
      },
    },
  ],
});

export const sharedTypographyRecipe = cva({
  variants: {
    margin: {
      true: {
        mb: '2',
      },
    },
    bold: {
      true: {
        fontWeight: 'semibold',
      },
    },
    italic: {
      true: {
        fontStyle: 'italic',
      },
    },
    underline: {
      true: {
        textDecoration: 'underline',
        textUnderlineOffset: '[2px]',
      },
    },
    listitem: {
      true: {
        ml: '8',
      },
    },
  },
});

export const textRecipe = cva({
  variants: {
    textStyle: {
      body: { textStyle: 'body' },
      description: { textStyle: 'description' },
      caption: { textStyle: 'caption' },
      label: { textStyle: 'label' },
    },
  },
  defaultVariants: {
    textStyle: 'body',
  },
});

export const titleRecipe = cva({
  base: {
    color: 'fg',
    _dark: {
      color: 'fg',
    },
  },
  variants: {
    size: {
      '2xl': { textStyle: 'heading1' },
      xl: { textStyle: 'heading2' },
      lg: { textStyle: 'heading3' },
      md: { textStyle: 'heading4' },
      body: { textStyle: 'body' },
    },
  },
});

export type TextLineBarRecipeProps = RecipeVariantProps<typeof textLineBarRecipe>;
export type SharedTypographyRecipeProps = RecipeVariantProps<typeof sharedTypographyRecipe>;
export type TextRecipeProps = RecipeVariantProps<typeof textRecipe>;
export type TitleRecipeProps = RecipeVariantProps<typeof titleRecipe>;
