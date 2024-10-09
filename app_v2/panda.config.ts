import { defineConfig } from '@pandacss/dev';

import { basColorTokens, semanticColorTokens, siisColorTokens } from './panda.config/colors';
import { insetFocusRing } from './panda.config/utilities/focusring.utility';

export default defineConfig({
  // Whether to use css reset
  preflight: true,
  strictTokens: true,
  presets: ['@pandacss/preset-base', '@pandacss/preset-panda'],
  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  globalCss: {
    html: {
      height: '100%',
      width: '100%',
      overflow: 'hidden',
    },
    body: {
      height: '100%',
      width: '100%',
      bg: '{colors.htmlBackground}',
      color: 'fg',
      overflow: 'hidden',
      fontFamily: '{fonts.openSans}',
    },
    '#root': {
      height: '100%',
      width: '100%',
    },
  },

  globalVars: {
    '--font-open-sans': 'Open Sans Variable, sans-serif',
  },

  utilities: {
    extend: {
      insetFocusRing,
    },
  },

  hooks: {
    'config:resolved': ({ config, utils }) => {
      // Remove every colors
      const updated = utils.omit(config, ['theme.tokens.colors', 'theme.semanticTokens.colors']);
      updated.theme ??= {};
      updated.theme.tokens ??= {};
      updated.theme.semanticTokens ??= {};

      // Only add those from your custom preset
      updated.theme.tokens.colors = { ...basColorTokens, ...siisColorTokens };
      updated.theme.tokens.fonts = {
        openSans: {
          value: 'var(--font-open-sans)',
        },
      };
      updated.theme.semanticTokens.colors = semanticColorTokens;
      return updated;
    },
  },

  jsxFramework: 'react',
  jsxStyleProps: 'all',

  // The output directory for your css system
  outdir: 'styled-system',
});
