module.exports = {
  root: true,
  extends: '@react-native-community',
  plugins: ['simple-import-sort'],
  rules: {
    'react/no-string-refs': 'off',
    'no-alert': 'off',
    'simple-import-sort/imports': 'error',
  },
};
