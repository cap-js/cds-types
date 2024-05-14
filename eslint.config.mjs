// @ts-check

import eslintjs from '@eslint/js'
import globals from 'globals'
import eslintplugin from '@stylistic/eslint-plugin-ts'
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslintjs.configs.recommended,
    ...tseslint.configs.recommended,
  {
    ignores: [
      '**/test/integration/**',
      'node_modules/**',
      'dist/**',
      'test/**'
    ],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node }
    },
    files: ['**/*.ts'],
    plugins: { '@stylistic/ts': eslintplugin },
    rules: {
      '@stylistic/ts/brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
      '@stylistic/ts/indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'no-multiple-empty-lines': ['error'],
      '@stylistic/ts/member-delimiter-style': ['error', {
        'multiline': {
          'delimiter': 'comma'
        },
        'singleline': {
          'delimiter': 'comma'
        },
        'multilineDetection': 'brackets',
        'overrides': {
          'interface': {
            'multiline': {
              'delimiter': 'none'
            }
          }
        }
      }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-declaration-merging': 'off'
    }
  }
)