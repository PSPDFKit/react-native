const {
  withAppBuildGradle,
  withGradleProperties,
} = require('expo/config-plugins');

// Kept in sync with android/build.gradle by a test.
const MIN_KOTLIN_VERSION = '2.4.10';
const COMPILE_SDK = 37;
const COMPILE_SDK_MINOR = 1;

const KOTLIN_VERSION_PROPERTY = 'android.kotlinVersion';
const COMPILE_SDK_LINE =
  /^([ \t]*)compileSdk(?:Version)?[ \t]+rootProject\.ext\.compileSdkVersion[ \t]*(\r?)$/m;
const BLOCK_TAG = 'nutrient-compile-sdk';
const APP_COMPILE_SDK = /^[ \t]*compileSdk(?:Version)?[ \t=]+(\d+)[ \t]*\r?$/m;
const APP_COMPILE_SDK_MINOR = /^[ \t]*compileSdkMinor[ \t=]+(\d+)/m;
const GENERATED_BLOCK = new RegExp(
  `^[ \\t]*// @generated begin ${BLOCK_TAG} .*\\r?\\n[\\s\\S]*?^[ \\t]*// @generated end ${BLOCK_TAG}\\r?\\n?`,
  'm',
);

function isVersionAtLeast(version, minimum) {
  const parse = value =>
    String(value)
      .split(/[.-]/)
      .slice(0, 3)
      .map(part => parseInt(part, 10) || 0);
  const actual = parse(version);
  const required = parse(minimum);
  for (let i = 0; i < 3; i++) {
    if ((actual[i] || 0) !== required[i]) {
      return (actual[i] || 0) > required[i];
    }
  }
  return true;
}

// Expo's root build.gradle reads the Kotlin Gradle plugin version from this property.
function raiseKotlinVersion(properties) {
  const entry = properties.find(
    item => item.type === 'property' && item.key === KOTLIN_VERSION_PROPERTY,
  );
  if (entry && isVersionAtLeast(entry.value, MIN_KOTLIN_VERSION)) {
    return properties;
  }
  console.warn(
    `[@nutrient-sdk/react-native] Setting \`${KOTLIN_VERSION_PROPERTY}\` to ${MIN_KOTLIN_VERSION} (was ${
      entry ? entry.value : 'not set'
    }), the oldest Kotlin this package builds with. The whole app is compiled with it.`,
  );
  if (entry) {
    entry.value = MIN_KOTLIN_VERSION;
  } else {
    properties.push({
      type: 'property',
      key: KOTLIN_VERSION_PROPERTY,
      value: MIN_KOTLIN_VERSION,
    });
  }
  return properties;
}

// Expo sets only the major `compileSdk`, and the app has to compile against android-37.1 or later.
function addCompileSdkMinor(buildGradle) {
  // Drop the block an earlier prebuild added, so a newer package version can replace it.
  const contents = buildGradle.replace(GENERATED_BLOCK, '');

  const appMinor = contents.match(APP_COMPILE_SDK_MINOR);
  if (appMinor) {
    const appMajor = contents.match(APP_COMPILE_SDK);
    const major = appMajor ? Number(appMajor[1]) : COMPILE_SDK;
    const minor = Number(appMinor[1]);
    if (
      major < COMPILE_SDK ||
      (major === COMPILE_SDK && minor < COMPILE_SDK_MINOR)
    ) {
      console.warn(
        `[@nutrient-sdk/react-native] android/app/build.gradle sets \`compileSdkMinor ${minor}\`${
          appMajor ? ` with \`compileSdk ${major}\`` : ''
        }, which is older than android-${COMPILE_SDK}.${COMPILE_SDK_MINOR}; remove it or raise it, or the build fails in \`:app:checkReleaseAarMetadata\`.`,
      );
    }
    return contents;
  }

  const match = contents.match(COMPILE_SDK_LINE);
  if (!match) {
    console.warn(
      `[@nutrient-sdk/react-native] Could not find \`compileSdk rootProject.ext.compileSdkVersion\` in android/app/build.gradle; set \`compileSdk ${COMPILE_SDK}\` and \`compileSdkMinor ${COMPILE_SDK_MINOR}\` or later in the app module yourself.`,
    );
    return contents;
  }

  // `compileSdk` resets the minor version, so the minor has to come after it.
  const [line, indent, cr] = match;
  const block = [
    line.slice(0, line.length - cr.length),
    `${indent}// @generated begin ${BLOCK_TAG} - expo prebuild (DO NOT MODIFY)`,
    `${indent}if (rootProject.ext.compileSdkVersion.toString().tokenize('.')[0].toInteger() <= ${COMPILE_SDK}) {`,
    `${indent}    compileSdk ${COMPILE_SDK}`,
    `${indent}    compileSdkMinor ${COMPILE_SDK_MINOR}`,
    `${indent}}`,
    `${indent}// @generated end ${BLOCK_TAG}`,
  ].join(`${cr}\n`);
  return contents.replace(COMPILE_SDK_LINE, block + cr);
}

const withNutrientAndroidToolchain = config => {
  config = withGradleProperties(config, config => {
    config.modResults = raiseKotlinVersion(config.modResults);
    return config;
  });

  return withAppBuildGradle(config, config => {
    if (config.modResults.language !== 'groovy') {
      console.warn(
        `[@nutrient-sdk/react-native] android/app/build.gradle is not Groovy; add \`compileSdkMinor ${COMPILE_SDK_MINOR}\` to the app module yourself when it compiles against API ${COMPILE_SDK}.`,
      );
      return config;
    }
    config.modResults.contents = addCompileSdkMinor(config.modResults.contents);
    return config;
  });
};

module.exports = withNutrientAndroidToolchain;
module.exports.raiseKotlinVersion = raiseKotlinVersion;
module.exports.addCompileSdkMinor = addCompileSdkMinor;
module.exports.MIN_KOTLIN_VERSION = MIN_KOTLIN_VERSION;
module.exports.COMPILE_SDK = COMPILE_SDK;
module.exports.COMPILE_SDK_MINOR = COMPILE_SDK_MINOR;
