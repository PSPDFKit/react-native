const { createRunOncePlugin } = require('expo/config-plugins');
const withNutrientAndroidTheme = require('./withNutrientAndroidTheme');
const withNutrientAndroidToolchain = require('./withNutrientAndroidToolchain');
const pkg = require('../package.json');

const withNutrient = (config, props = {}) => {
  config = withNutrientAndroidTheme(config, props);
  config = withNutrientAndroidToolchain(config);
  return config;
};

module.exports = createRunOncePlugin(withNutrient, pkg.name, pkg.version);
