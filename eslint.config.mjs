import { defineConfig } from 'eslint/config';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import tsParser from '@typescript-eslint/parser';
import tseslint from 'typescript-eslint';
import eslintjs from '@eslint/js';
import prettierconfig from 'eslint-plugin-prettier/recommended';

export default defineConfig(eslintjs.configs.recommended, tseslint.configs.recommended, prettierconfig, {
  plugins: {
    '@typescript-eslint': typescriptEslint,
    prettier,
  },

  languageOptions: {
    parser: tsParser,
  },

  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
  },
});
