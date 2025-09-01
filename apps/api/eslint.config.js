import baseConfig, {
  createTypeScriptConfig,
  createTestConfig,
} from '../../eslint.config.base.js';

/**
 * API package ESLint configuration
 * Extends base config with API-specific rules
 */
export default [
  ...baseConfig,
  // API TypeScript configuration
  createTypeScriptConfig({
    packageType: 'api',
    tsconfigPath: './tsconfig.json',
  }),
  // API test configuration
  createTestConfig({ hasReact: false }),
];
