import { defineTextStyles } from '@pandacss/dev';

export const textTokens = defineTextStyles({
  body: {
    description: 'The base font style',
    value: {
      fontWeight: '300',
      fontSize: 'md',
    },
  },
  label: {
    description: 'The label font style for field inputs',
    value: {
      fontWeight: '300',
      fontSize: 'sm',
      textTransform: 'uppercase',
    },
  },
  description: {
    description: 'The description font style for field inputs',
    value: {
      fontWeight: '200',
      fontSize: 'sm',
    },
  },
  validationError: {
    description: 'The error font style',
    value: {
      fontSize: 'sm',
      fontWeight: '300',
    },
  },
  heading1: {
    description: 'The largest text style in the system, used for main titles on the page.',
    value: {
      fontWeight: '600',
      fontSize: { base: 'xl', md: '3xl' },
    },
  },
  heading2: {
    description: 'The second largest text style in the system, used for sub-headings',
    value: {
      fontWeight: '600',
      fontSize: { base: 'xl', md: '2xl' },
    },
  },
  heading3: {
    description: 'The third largest heading style in the system, used for sub-sub-headings',
    value: {
      fontWeight: '600',
      fontSize: { base: 'lg', md: 'xl' },
    },
  },
  heading4: {
    description:
      'The smallest heading style in the system, used for minor headings for example in the footer',
    value: {
      fontWeight: '600',
      fontSize: { base: 'md', md: 'lg' },
    },
  },
  caption: {
    description: 'caption style',
    value: {
      fontWeight: '300',
      fontSize: { base: 'xs', md: 'sm' },
    },
  },
});
