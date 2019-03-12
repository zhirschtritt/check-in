module.exports = {
  root: true,
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx', '.vue'],
      },
    },
  },
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb', '@vue/typescript', 'prettier'],

  rules: {
    'import/extensions': 'ignorePackages',
    'import/prefer-default-export': 'false',
    'class-methods-use-this': 0,
    'prettier/prettier': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'lines-between-class-members': 0,
  },
  parserOptions: {
    parser: 'typescript-eslint-parser',
  },
  plugins: ['prettier'],

  extends: ['plugin:vue/essential', '@vue/airbnb', '@vue/typescript', 'prettier'],

  parserOptions: {
    parser: 'typescript-eslint-parser',
  },
};
