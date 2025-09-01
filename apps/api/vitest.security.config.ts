/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 10000,
    hookTimeout: 10000,
    env: {
      NODE_ENV: 'test',
      RATE_LIMIT_MAX: '5', // Very low for security testing
    },
    setupFiles: [],
    include: ['test/security/**/*.test.ts'],
    exclude: ['test/integration/**', 'test/unit/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@test': path.resolve(__dirname, './test'),
    },
  },
});
