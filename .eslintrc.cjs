module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint','react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  env: { browser: true, es2021: true },
  rules: {
    '@typescript-eslint/no-explicit-any': 0,
    'react-hooks/rules-of-hooks': 'error'
  }
};