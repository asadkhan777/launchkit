import {
  createTypeScriptConfig,
  commonIgnores,
} from '../../eslint.config.base.js';

export default [
  commonIgnores,
  createTypeScriptConfig({
    packageType: 'tests',
    tsconfigPath: './tsconfig.json',
    hasReact: false,
  }),
];
