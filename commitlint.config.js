export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'ci',
        'build',
        'revert'
      ]
    ],
    'scope-enum': [
      2,
      'always',
      [
        'api',
        'web',
        'common',
        'ui',
        'sdk',
        'deps',
        'config',
        'v1', 'v2', 'v3', 'v4', 'v5'
      ]
    ]
  }
};
