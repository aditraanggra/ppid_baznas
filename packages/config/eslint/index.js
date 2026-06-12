/**
 * Shared ESLint config for all apps & packages.
 * Use via: { extends: ['@ppid/config/eslint'] }
 */
module.exports = {
  root: true,
  env: { browser: true, node: true, es2022: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType:  'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any':         'error',
    '@typescript-eslint/no-unused-vars':          ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
    'no-var':       'error',
    'prefer-const': 'error',
    'eqeqeq':       ['error', 'always'],
  },
  ignorePatterns: ['node_modules', 'dist', '.next', '.turbo', 'src/migrations'],
}
