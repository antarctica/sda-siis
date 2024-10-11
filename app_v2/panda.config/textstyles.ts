import { defineTextStyles } from '@pandacss/dev';

export const textTokens = defineTextStyles({
  body: {
    description: 'The base font style',
    value: {
      fontWeight: '400',
      fontSize: '{fontSizes.md}',
    },
  },
  heading1: {
    description: 'The largest text style in the system, used for main titles on the page.',
    value: {
      fontWeight: '600',
      fontSize: { base: '{fontSizes.2xl}', md: '{fontSizes.3xl}' },
    },
  },
  heading2: {
    description: 'The second largest text style in the system, used for sub-headings',
    value: {
      fontWeight: '600',
      fontSize: { base: '{fontSizes.xl}', md: '{fontSizes.2xl}' },
    },
  },
  heading3: {
    description: 'The third largest heading style in the system, used for sub-sub-headings',
    value: {
      fontWeight: '600',
      fontSize: { base: '{fontSizes.lg}', md: '{fontSizes.xl}' },
    },
  },
  heading4: {
    description:
      'The smallest heading style in the system, used for minor headings for example in the footer',
    value: {
      fontWeight: '600',
      fontSize: { base: '{fontSizes.md}', md: '{fontSizes.lg}' },
    },
  },
  caption: {
    description: 'caption style',
    value: {
      fontWeight: '400',
      fontSize: { base: '{fontSizes.xs}', md: '{fontSizes.sm}' },
    },
  },
});
