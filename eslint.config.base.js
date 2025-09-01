import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

/**
 * Base ESLint configuration for LaunchKit AI monorepo
 * Provides shared rules and patterns for all packages
 */

// Common globals for all Node.js/browser environments
const commonGlobals = {
  console: 'readonly',
  process: 'readonly',
  Buffer: 'readonly',
  __dirname: 'readonly',
  __filename: 'readonly',
  global: 'readonly',
  module: 'readonly',
  require: 'readonly',
  exports: 'readonly',
};

// Test environment globals
const testGlobals = {
  ...commonGlobals,
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  describe: 'readonly',
  it: 'readonly',
  expect: 'readonly',
  beforeAll: 'readonly',
  afterAll: 'readonly',
  beforeEach: 'readonly',
  afterEach: 'readonly',
  vi: 'readonly',
};

// Browser/React globals
const browserGlobals = {
  ...commonGlobals,
  fetch: 'readonly',
  Request: 'readonly',
  Response: 'readonly',
  URL: 'readonly',
  URLSearchParams: 'readonly',
  document: 'readonly',
  window: 'readonly',
};

// Common TypeScript rules
const commonTypeScriptRules = {
  ...typescript.configs.recommended.rules,
  '@typescript-eslint/no-explicit-any': 'warn',
  'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
  '@typescript-eslint/no-unused-vars': 'warn',
  'no-unused-vars': 'off',
  '@typescript-eslint/triple-slash-reference': 'off',
};

// React-specific rules
const reactRules = {
  ...react.configs.recommended.rules,
  ...reactHooks.configs.recommended.rules,
  ...jsxA11y.configs.recommended.rules,
  'react/react-in-jsx-scope': 'off',
  'react/prop-types': 'off',
};

/**
 * Creates TypeScript configuration for a package
 * @param {Object} options - Configuration options
 * @param {string} options.packageType - 'api' | 'ui' | 'common' | 'sdk'
 * @param {string} options.tsconfigPath - Path to tsconfig.json
 * @param {boolean} options.hasReact - Whether package uses React
 */
export function createTypeScriptConfig({
  packageType,
  tsconfigPath = './tsconfig.json',
  hasReact = false,
}) {
  const plugins = {
    '@typescript-eslint': typescript,
  };

  const rules = { ...commonTypeScriptRules };
  const settings = {};
  let globals = commonGlobals;

  // Add React configuration if needed
  if (hasReact) {
    plugins.react = react;
    plugins['react-hooks'] = reactHooks;
    plugins['jsx-a11y'] = jsxA11y;
    Object.assign(rules, reactRules);
    settings.react = { version: 'detect' };
    globals = browserGlobals;
  }

  // API-specific globals
  if (packageType === 'api') {
    globals = {
      ...globals,
      fetch: 'readonly',
      Request: 'readonly',
      Response: 'readonly',
      URL: 'readonly',
      URLSearchParams: 'readonly',
    };
  }

  return {
    files: hasReact ? ['**/*.{ts,tsx}'] : ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: tsconfigPath,
      },
      globals,
    },
    plugins,
    settings,
    rules,
  };
}

/**
 * Creates test configuration for a package
 * @param {Object} options - Configuration options
 * @param {boolean} options.hasReact - Whether tests use React
 */
export function createTestConfig({ hasReact = false }) {
  const plugins = {
    '@typescript-eslint': typescript,
  };

  const rules = { ...commonTypeScriptRules };
  const settings = {};

  if (hasReact) {
    plugins.react = react;
    plugins['react-hooks'] = reactHooks;
    plugins['jsx-a11y'] = jsxA11y;
    Object.assign(rules, reactRules);
    settings.react = { version: 'detect' };
  }

  return {
    files: [
      '**/test/**/*.{ts,tsx}',
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}',
    ],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: false, // Disable project references for test files
      },
      globals: testGlobals,
    },
    plugins,
    settings,
    rules,
  };
}

/**
 * Creates Storybook configuration
 */
export function createStorybookConfig() {
  return {
    files: ['**/*.stories.{ts,tsx}', '.storybook/**/*.{ts,tsx,js}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: false, // Disable strict project references for Storybook
      },
      globals: browserGlobals,
    },
    plugins: {
      '@typescript-eslint': typescript,
      react: react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // Lighter rules for stories
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  };
}

/**
 * Common ignore patterns for all packages
 */
export const commonIgnores = {
  ignores: [
    'dist/**',
    'build/**',
    'node_modules/**',
    'storybook-static/**',
    '.storybook-static/**',
    'coverage/**',
    '**/*.d.ts',
    '.turbo/**',
    '**/*.cookie',
    '.betterstack.yml',
    '**/*.yml',
  ],
};

/**
 * Base configuration that all packages should extend
 */
export default [js.configs.recommended, commonIgnores];
