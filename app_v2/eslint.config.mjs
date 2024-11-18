import { FlatCompat } from '@eslint/eslintrc';
import panda from '@pandacss/eslint-plugin';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import { config, configs as tsConfigs } from 'typescript-eslint';

const compat = new FlatCompat();

export default config(
  {
    name: 'ignores',
    ignores: ['**/dist/**', '**/node_modules/**', 'styled-system/**/*', 'node_modules', 'dist'],
  },
  {
    ...pluginReact.configs.flat.recommended,
    rules: {
      'react/prop-types': 'off',
      'react/display-name': 'off',
    },
  },
  {
    extends: [...tsConfigs.recommended, ...compat.config(reactHooks.configs.recommended)],
    plugins: {
      '@pandacss': panda,
      'simple-import-sort': simpleImportSort,
      'react-refresh': reactRefresh,
      prettier: eslintPluginPrettier,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...panda.configs.recommended.rules,
      '@pandacss/no-debug': 'off',
      '@pandacss/no-margin-properties': 'off',
      '@pandacss/no-hardcoded-color': ['error', { noOpacity: true }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'prettier/prettier': [
        'error',
        {},
        {
          usePrettierrc: true,
        },
      ],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
);
