const { createRunOncePlugin } = require('expo/config-plugins');
const withNutrientAndroidTheme = require('./withNutrientAndroidTheme');
const pkg = require('../package.json');

const withNutrient = (config, props = {}) => {
  config = withNutrientAndroidTheme(config, props);
  return config;
};

module.exports = createRunOncePlugin(withNutrient, pkg.name, pkg.version);
