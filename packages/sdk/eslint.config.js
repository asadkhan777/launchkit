import {
  createTypeScriptConfig,
  commonIgnores,
} from '../../eslint.config.base.js';

export default [
  commonIgnores,
  createTypeScriptConfig({
    packageType: 'sdk',
    tsconfigPath: './tsconfig.json',
    hasReact: false,
  }),
];
