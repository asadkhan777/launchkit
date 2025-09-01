// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [js.configs.recommended, {
  // Storybook configuration files - no strict TypeScript project references
  files: ['**/.storybook/*.{ts,tsx,js,jsx}', '**/storybook/**/*.{ts,tsx,js,jsx}'],
  languageOptions: {
    parser: typescriptParser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // Don't use strict project references for Storybook files
    },
    globals: {
      console: 'readonly',
      process: 'readonly',
      Buffer: 'readonly',
      __dirname: 'readonly',
      __filename: 'readonly',
      global: 'readonly',
      module: 'readonly',
      require: 'readonly',
      exports: 'readonly',
      fetch: 'readonly',
      Request: 'readonly',
      Response: 'readonly',
      URL: 'readonly',
      URLSearchParams: 'readonly',
    },
  },
  plugins: {
    '@typescript-eslint': typescript,
  },
  rules: {
    ...typescript.configs.recommended.rules,
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/triple-slash-reference': 'off',
  },
}, {
  files: ['**/*.{ts,tsx}'],
  // Exclude Storybook files from this strict TypeScript configuration
  ignores: ['**/.storybook/**', '**/storybook/**'],
  languageOptions: {
    parser: typescriptParser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      project: './tsconfig.json',
    },
    globals: {
      console: 'readonly',
      process: 'readonly',
      Buffer: 'readonly',
      __dirname: 'readonly',
      __filename: 'readonly',
      global: 'readonly',
      module: 'readonly',
      require: 'readonly',
      exports: 'readonly',
      fetch: 'readonly',
      Request: 'readonly',
      Response: 'readonly',
      URL: 'readonly',
      URLSearchParams: 'readonly',
    },
  },
  plugins: {
    '@typescript-eslint': typescript,
    'react': react,
    'react-hooks': reactHooks,
    'jsx-a11y': jsxA11y,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    ...typescript.configs.recommended.rules,
    ...react.configs.recommended.rules,
    ...reactHooks.configs.recommended.rules,
    ...jsxA11y.configs.recommended.rules,
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-unused-vars': 'off', // Turn off base rule since we use TypeScript version
    '@typescript-eslint/triple-slash-reference': 'off', // Allow Next.js triple slash references
    'react/react-in-jsx-scope': 'off', // Not needed with new JSX transform
    'react/prop-types': 'off', // Using TypeScript for prop validation
  },
}, {
  // Test files configuration
  files: ['**/test/**/*.{ts,tsx}', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
  languageOptions: {
    parser: typescriptParser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // Don't require strict project references for test files
      project: false,
    },
    globals: {
      // Vitest globals
      describe: 'readonly',
      it: 'readonly',
      test: 'readonly',
      expect: 'readonly',
      vi: 'readonly',
      beforeEach: 'readonly',
      afterEach: 'readonly',
      beforeAll: 'readonly',
      afterAll: 'readonly',
      // DOM globals for jsdom
      document: 'readonly',
      window: 'readonly',
      navigator: 'readonly',
      HTMLElement: 'readonly',
      // Node globals for test files
      console: 'readonly',
      process: 'readonly',
      Buffer: 'readonly',
      __dirname: 'readonly',
      __filename: 'readonly',
      global: 'readonly',
      module: 'readonly',
      require: 'readonly',
      exports: 'readonly',
      fetch: 'readonly',
      Request: 'readonly',
      Response: 'readonly',
      URL: 'readonly',
      URLSearchParams: 'readonly',
    },
  },
  plugins: {
    '@typescript-eslint': typescript,
    'react': react,
    'react-hooks': reactHooks,
    'jsx-a11y': jsxA11y,
  },
  rules: {
    ...typescript.configs.recommended.rules,
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-unused-vars': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
}, {
  files: ['**/*.{js,jsx}'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      console: 'readonly',
      process: 'readonly',
      module: 'readonly',
      require: 'readonly',
      exports: 'readonly',
    },
  },
  rules: {
    'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
  },
}, {
  ignores: [
    '.next/**', 
    'node_modules/**', 
    'dist/**', 
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/storybook-static/**',
    '**/.storybook-static/**',
    '**/.storybook/**',
    '**/coverage/**',
    '**/*.d.ts',
    '**/turbo/**',
    '**/.turbo/**'
  ],
}, ...storybook.configs["flat/recommended"]];
