// packages/eslint-config/base.js
import baseConfig from '../../eslint.config.mjs';

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [...baseConfig];
