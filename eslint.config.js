import baseConfig, {
  createTypeScriptConfig,
  createTestConfig,
} from './eslint.config.base.js';

/**
 * Root monorepo ESLint configuration
 * Provides workspace-wide linting standards
 */
export default [
  ...baseConfig,
  // Workspace-specific TypeScript configuration
  createTypeScriptConfig({
    packageType: 'common',
    tsconfigPath: './tsconfig.json',
  }),
  // Test configuration for workspace root
  createTestConfig({ hasReact: false }),
];
