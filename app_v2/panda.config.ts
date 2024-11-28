import { defineConfig } from '@pandacss/dev';

import { keyframes } from './panda.config/animation/keyframes';
import { textTokens } from './panda.config/textStyles/textStyles';
import { basColorTokens } from './panda.config/tokens/basColors';
import { additionalBorderRadii } from './panda.config/tokens/borderRadii';
import { semanticColorTokens } from './panda.config/tokens/semanticColors';
import { siisColorTokens } from './panda.config/tokens/siisColors';
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
      fontOpticalSizing: 'auto',
      fontKerning: 'auto',
      _dark: {
        '--calcite-color-brand': '{colors.fg.accent}',
      },
      '--calcite-font-family': '{fonts.inter}',
      '--calcite-color-brand': '{colors.fg.accent}',
    },
    'body:has(dialog[open])': {
      overflow: 'hidden',
    },
    '.esri-view': {
      fontFamily: '{fonts.inter} !important',
    },
    '#root': {
      height: '100%',
      width: '100%',
      position: 'fixed',
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
    '--font-inter': 'Inter, monospace',
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
      updated.theme.tokens.radii = { ...config.theme?.tokens?.radii, ...additionalBorderRadii };
      updated.theme.semanticTokens.colors = semanticColorTokens;
      updated.theme.keyframes = keyframes;
      return updated;
    },
  },

  jsxFramework: 'react',
  jsxStyleProps: 'all',

  // The output directory for your css system
  outdir: 'styled-system',
});
