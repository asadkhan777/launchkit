import baseConfig, {
  createTypeScriptConfig,
  createTestConfig,
  createStorybookConfig,
} from '../../eslint.config.base.js';

/**
 * UI package ESLint configuration
 * Extends base config with React and Storybook rules
 */
export default [
  ...baseConfig,
  // UI TypeScript configuration with React
  createTypeScriptConfig({
    packageType: 'ui',
    tsconfigPath: './tsconfig.json',
    hasReact: true,
  }),
  // UI test configuration with React
  createTestConfig({ hasReact: true }),
  // Storybook configuration
  createStorybookConfig(),
];
