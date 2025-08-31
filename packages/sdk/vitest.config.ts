import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./test/setup.ts'],
    environment: 'node',
    globals: true,
    testTimeout: 30000,
    // Ensure tests run sequentially to avoid database conflicts
    sequence: {
      concurrent: false
    },
    env: {
      DATABASE_URL: 'file:./db/test-sdk.db'
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        'dist/',
        '**/*.d.ts',
      ],
    },
  },
});
