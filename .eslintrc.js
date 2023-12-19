module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:react/recommended', '@react-native'],
  plugins: ['simple-import-sort'],
  parserOptions: {
    ecmaVersion: 12,
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'react/no-string-refs': 0,
    'no-alert': 0,
    'simple-import-sort/imports': 2,
  },
};
