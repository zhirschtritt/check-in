module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb', '@vue/typescript', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'import/extensions': 'ignorePackages',
    'import/prefer-default-export': 'false',
    'prettier/prettier': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
  parserOptions: {
    parser: 'typescript-eslint-parser',
  },
};
