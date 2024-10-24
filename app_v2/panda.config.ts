import { defineConfig } from '@pandacss/dev';

import { basColorTokens, semanticColorTokens, siisColorTokens } from './panda.config/colors';
import { textTokens } from './panda.config/textstyles';
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
      height: '100% !important',
      width: '100%',
      bg: '{colors.htmlBackground}',
      color: 'fg',
      overflow: 'hidden',
      fontFamily: '{fonts.inter}',
      _dark: {
        '--calcite-color-brand': '{colors.fg.accent}',
      },
      '--calcite-color-brand': '{colors.fg}',
    },
    'body:has(dialog[open])': {
      overflow: 'hidden',
    },
    '#root': {
      height: '100%',
      width: '100%',
    },
    'dialog:modal': {
      maxWidth: '100vw',
      maxHeight: '100vh',
    },
    'dialog:-internal-dialog-in-top-layer': {
      maxWidth: '100vw',
      maxHeight: '100vh',
    },
    'dialog::backdrop': {
      pointerEvents: 'none',
    },
    'dialog[open]': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },

  globalVars: {
    '--font-inter': 'Inter Variable, sans-serif',
  },

  utilities: {
    extend: {
      insetFocusRing,
    },
  },
  theme: {
    extend: {
      tokens: {
        fonts: {
          inter: {
            value: 'var(--font-inter)',
          },
        },
      },
      textStyles: textTokens,
    },
  },

  hooks: {
    'config:resolved': ({ config, utils }) => {
      // Remove every colors
      const updated = utils.omit(config, ['theme.tokens.colors', 'theme.semanticTokens.colors']);
      updated.theme ??= {};
      updated.theme.tokens ??= {};
      updated.theme.semanticTokens ??= {};
      updated.theme.textStyles ??= {};

      // Only add those from your custom preset
      updated.theme.tokens.colors = { ...basColorTokens, ...siisColorTokens };
      updated.theme.semanticTokens.colors = semanticColorTokens;
      return updated;
    },
  },

  jsxFramework: 'react',
  jsxStyleProps: 'all',

  // The output directory for your css system
  outdir: 'styled-system',
});
