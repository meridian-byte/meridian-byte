import { config } from '@repo/eslint-config/next-js';
import prettierPlugin from 'eslint-plugin-prettier';

/** @type {import("eslint").Linter.Config} */

const projectConfig = [
  // extend your turborepo Next.js config
  ...config,

  // ignore paths
  {
    ignores: [
      '.next',
      'node_modules',
      'dist',
      'build',
      'coverage',
      'out',
      '**/*.config.js',
      '**/*.config.cjs',
      '**/*.config.mjs',
      'pnpm-lock.yaml',
    ],
  },
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      '@next/next/no-img-element': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      'prettier/prettier': 'warn',
    },
  },
];

export default projectConfig;
