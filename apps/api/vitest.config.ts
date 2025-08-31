import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
    globals: true,
    testTimeout: 30000,
    // Ensure tests run sequentially to avoid database conflicts
    sequence: {
      concurrent: false
    },
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'file:./db/test-api.db'
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
