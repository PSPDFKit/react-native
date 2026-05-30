const { withAndroidStyles } = require('expo/config-plugins');

const THEME_PRESET = {
  // DayNight + Bridge is the default because it is more robust with Expo edge-to-edge.
  edgeToEdge: '@style/NutrientRN.AppTheme',
  // Full Nutrient app theme for apps that want the SDK's complete default styling.
  fullNutrient: '@style/PSPDFKit.Theme.Default',
};

function resolveThemeParent(props = {}) {
  if (typeof props.androidAppThemeParent === 'string' && props.androidAppThemeParent.length > 0) {
    return props.androidAppThemeParent;
  }

  if (props.androidThemePreset && THEME_PRESET[props.androidThemePreset]) {
    return THEME_PRESET[props.androidThemePreset];
  }

  return THEME_PRESET.edgeToEdge;
}

function setAppThemeParent(styles, parent) {
  const styleList = styles?.resources?.style;
  if (!Array.isArray(styleList)) {
    console.warn(
      '[@nutrient-sdk/react-native] Could not find <resources><style> in Android styles.xml; AppTheme parent was not modified.'
    );
    return styles;
  }

  const appTheme = styleList.find((style) => style?.$?.name === 'AppTheme');
  if (!appTheme || !appTheme.$) {
    console.warn(
      '[@nutrient-sdk/react-native] No <style name="AppTheme"> found in Android styles.xml; theme fix was not applied. Set `androidAppThemeParent` explicitly if your app uses a different theme name.'
    );
    return styles;
  }

  appTheme.$.parent = parent;
  return styles;
}

const withNutrientAndroidTheme = (config, props = {}) => {
  const themeParent = resolveThemeParent(props);

  return withAndroidStyles(config, (config) => {
    config.modResults = setAppThemeParent(config.modResults, themeParent);
    return config;
  });
};

module.exports = withNutrientAndroidTheme;
