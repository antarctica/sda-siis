// @ts-check
import panda from '@pandacss/eslint-plugin';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    ignores: ['**/dist/**', '**/node_modules/**', 'styled-system/**'],
    plugins: {
      '@pandacss': panda,
      'simple-import-sort': simpleImportSort,
      'react-refresh': reactRefresh,
      prettier: eslintPluginPrettier,
      react: pluginReact,
      'react-hooks': reactHooks,
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
      ...pluginReact.configs.recommended.rules,
      ...pluginReact.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
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
      'react/prop-types': 'off',
      'react/display-name': 'off',
    },
  },
  ...tseslint.configs.recommended,
];
