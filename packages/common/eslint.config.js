import {
  createTypeScriptConfig,
  commonIgnores,
} from '../../eslint.config.base.js';

export default [
  commonIgnores,
  createTypeScriptConfig({
    packageType: 'common',
    tsconfigPath: './tsconfig.json',
    hasReact: false,
  }),
];
