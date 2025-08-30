
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'prettier'
  ],
  ignorePatterns: ['.next', 'node_modules', 'dist'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': ['warn', { allow: ['info', 'warn', 'error'] }]
  },
}
