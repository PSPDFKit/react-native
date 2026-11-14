// Mods run on prebuild, not when a plugin registers them, and the mod registered last runs first,
// the way Expo chains them.
jest.mock(
  'expo/config-plugins',
  () => {
    const withMod =
      (key: string) => (config: any, action: (config: any) => any) => {
        const next = config.mods[key];
        return {
          ...config,
          mods: {
            ...config.mods,
            [key]: (modResults: any) =>
              next(action({ ...config, modResults }).modResults),
          },
        };
      };
    return {
      createRunOncePlugin: (plugin: any) => plugin,
      withAndroidStyles: withMod('styles'),
      withAppBuildGradle: withMod('appBuildGradle'),
      withGradleProperties: withMod('gradleProperties'),
    };
  },
  { virtual: true },
);

import * as fs from 'fs';
import * as path from 'path';

const { withGradleProperties } = require('expo/config-plugins');
const withNutrientAndroidToolchain = require('../plugin/withNutrientAndroidToolchain');
const {
  raiseKotlinVersion,
  addCompileSdkMinor,
  MIN_KOTLIN_VERSION,
  COMPILE_SDK,
  COMPILE_SDK_MINOR,
} = withNutrientAndroidToolchain;
const withNutrient = require('../plugin');

const EXPO_APP_BUILD_GRADLE = `android {
    buildToolsVersion rootProject.ext.buildToolsVersion
    compileSdk rootProject.ext.compileSdkVersion

    namespace 'com.example'
}
`;

const COMPILE_SDK_MINOR_BLOCK = [
  '    compileSdk rootProject.ext.compileSdkVersion',
  '    // @generated begin nutrient-compile-sdk - expo prebuild (DO NOT MODIFY)',
  "    if (rootProject.ext.compileSdkVersion.toString().tokenize('.')[0].toInteger() <= 37) {",
  '        compileSdk 37',
  '        compileSdkMinor 1',
  '    }',
  '    // @generated end nutrient-compile-sdk',
].join('\n');

// The block an older package version would have added.
const OLDER_COMPILE_SDK_MINOR_BLOCK = COMPILE_SDK_MINOR_BLOCK.replace(
  'compileSdkMinor 1',
  'compileSdkMinor 0',
);

function kotlinProperty(value: string) {
  return { type: 'property', key: 'android.kotlinVersion', value };
}

const identity = (modResults: any) => modResults;

function expoConfig() {
  return {
    name: 'app',
    mods: {
      gradleProperties: identity,
      appBuildGradle: identity,
      styles: identity,
    },
  };
}

// Runs the registered mods against the files a new Expo app starts with.
function prebuild(
  config: any,
  appBuildGradle = { language: 'groovy', contents: EXPO_APP_BUILD_GRADLE },
) {
  return {
    gradleProperties: config.mods.gradleProperties([
      { type: 'property', key: 'newArchEnabled', value: 'true' },
    ]),
    appBuildGradle: config.mods.appBuildGradle(appBuildGradle),
    styles: config.mods.styles({
      resources: {
        style: [{ $: { name: 'AppTheme', parent: 'Theme.AppCompat' } }],
      },
    }),
  };
}

// Sets `android.kotlinVersion` the way `expo-build-properties` does.
function withKotlinVersion(config: any, version: string) {
  return withGradleProperties(config, (config: any) => {
    config.modResults = config.modResults
      .filter((item: any) => item.key !== 'android.kotlinVersion')
      .concat(kotlinProperty(version));
    return config;
  });
}

describe('Expo plugin Android toolchain', () => {
  let warn: jest.SpyInstance;

  beforeEach(() => {
    warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
  });

  describe('android.kotlinVersion', () => {
    test('is added when the app does not set it, with a warning', () => {
      expect(raiseKotlinVersion([])).toEqual([kotlinProperty('2.4.10')]);
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0][0]).toContain('to 2.4.10 (was not set)');
    });

    test.each(['2.2.10', '2.4.0', '1.9.24', '2.4.0-RC2'])(
      'raises %s to 2.4.10, with a warning',
      version => {
        expect(raiseKotlinVersion([kotlinProperty(version)])).toEqual([
          kotlinProperty('2.4.10'),
        ]);
        expect(warn).toHaveBeenCalledTimes(1);
        expect(warn.mock.calls[0][0]).toContain(`to 2.4.10 (was ${version})`);
      },
    );

    test.each(['2.4.10', '2.4.20', '2.5.0', '3.0.0-RC'])(
      'keeps %s',
      version => {
        expect(raiseKotlinVersion([kotlinProperty(version)])).toEqual([
          kotlinProperty(version),
        ]);
        expect(warn).not.toHaveBeenCalled();
      },
    );

    test('ignores comments that mention the key', () => {
      const comment = { type: 'comment', value: 'android.kotlinVersion=1.9.0' };
      expect(raiseKotlinVersion([comment])).toEqual([
        comment,
        kotlinProperty('2.4.10'),
      ]);
    });
  });

  describe('compileSdkMinor', () => {
    test('raises the app to android-37.1 after the compileSdk line', () => {
      expect(addCompileSdkMinor(EXPO_APP_BUILD_GRADLE)).toContain(
        COMPILE_SDK_MINOR_BLOCK,
      );
    });

    test('matches the older compileSdkVersion spelling', () => {
      const contents = EXPO_APP_BUILD_GRADLE.replace(
        'compileSdk ',
        'compileSdkVersion ',
      );
      expect(addCompileSdkMinor(contents)).toContain(
        '        compileSdkMinor 1',
      );
    });

    test('keeps CRLF line endings in a CRLF build.gradle', () => {
      const contents = EXPO_APP_BUILD_GRADLE.replace(/\n/g, '\r\n');
      const result = addCompileSdkMinor(contents);
      expect(result).toBe(
        addCompileSdkMinor(EXPO_APP_BUILD_GRADLE).replace(/\n/g, '\r\n'),
      );
      expect(addCompileSdkMinor(result)).toBe(result);
      expect(warn).not.toHaveBeenCalled();
    });

    test('changes no other line in a build.gradle with mixed line endings', () => {
      const contents = EXPO_APP_BUILD_GRADLE.replace(
        'compileSdk rootProject.ext.compileSdkVersion\n',
        'compileSdk rootProject.ext.compileSdkVersion\r\n',
      );
      const result = addCompileSdkMinor(contents);
      expect(result).toBe(
        contents.replace(
          '    compileSdk rootProject.ext.compileSdkVersion',
          COMPILE_SDK_MINOR_BLOCK.replace(/\n/g, '\r\n'),
        ),
      );
      expect(addCompileSdkMinor(result)).toBe(result);
    });

    test('is not added twice across repeated prebuilds', () => {
      const once = addCompileSdkMinor(EXPO_APP_BUILD_GRADLE);
      expect(addCompileSdkMinor(once)).toBe(once);
    });

    test('replaces the block an older package version added', () => {
      const contents = addCompileSdkMinor(EXPO_APP_BUILD_GRADLE).replace(
        COMPILE_SDK_MINOR_BLOCK,
        OLDER_COMPILE_SDK_MINOR_BLOCK,
      );
      expect(contents).toContain('compileSdkMinor 0');
      expect(addCompileSdkMinor(contents)).toBe(
        addCompileSdkMinor(EXPO_APP_BUILD_GRADLE),
      );
    });

    test.each([
      ['compileSdk 38\n    compileSdkMinor 0'],
      ['compileSdk 37\n    compileSdkMinor 1'],
      ['compileSdk 37\n    compileSdkMinor 2'],
      ['compileSdk rootProject.ext.compileSdkVersion\n    compileSdkMinor 1'],
    ])(
      'keeps what the app sets when it is android-37.1 or later: %j',
      lines => {
        const contents = EXPO_APP_BUILD_GRADLE.replace(
          'compileSdk rootProject.ext.compileSdkVersion',
          lines,
        );
        expect(addCompileSdkMinor(contents)).toBe(contents);
        expect(warn).not.toHaveBeenCalled();
      },
    );

    test.each([
      ['compileSdk 37\n    compileSdkMinor 0'],
      ['compileSdk 36\n    compileSdkMinor 1'],
      ['compileSdk rootProject.ext.compileSdkVersion\n    compileSdkMinor 0'],
    ])(
      'warns when the app sets a version older than android-37.1: %j',
      lines => {
        const contents = EXPO_APP_BUILD_GRADLE.replace(
          'compileSdk rootProject.ext.compileSdkVersion',
          lines,
        );
        expect(addCompileSdkMinor(contents)).toBe(contents);
        expect(warn).toHaveBeenCalledTimes(1);
        expect(warn.mock.calls[0][0]).toContain('older than android-37.1');
      },
    );

    test('leaves a hard-coded compileSdk unchanged and warns', () => {
      const contents = 'android {\n    compileSdk 36\n}\n';
      expect(addCompileSdkMinor(contents)).toBe(contents);
      expect(warn).toHaveBeenCalledTimes(1);
    });

    test('removes its own block when the compileSdk line is no longer found', () => {
      const contents = addCompileSdkMinor(EXPO_APP_BUILD_GRADLE).replace(
        'compileSdk rootProject.ext.compileSdkVersion',
        'compileSdk 36',
      );
      expect(addCompileSdkMinor(contents)).toBe(
        EXPO_APP_BUILD_GRADLE.replace(
          'compileSdk rootProject.ext.compileSdkVersion',
          'compileSdk 36',
        ),
      );
      expect(warn).toHaveBeenCalledTimes(1);
    });
  });

  describe('android/build.gradle', () => {
    const moduleBuildGradle = fs.readFileSync(
      path.join(__dirname, '..', 'android', 'build.gradle'),
      'utf8',
    );

    test('refuses the Kotlin versions the plugin raises', () => {
      const floor = moduleBuildGradle.match(
        /nutrientVersionAtLeast\(appKotlinVersion, \[(\d+), (\d+), (\d+)\]\)/,
      );
      expect(floor?.slice(1).join('.')).toBe(MIN_KOTLIN_VERSION);
    });

    test('compiles against the platform the plugin raises the app to', () => {
      expect(moduleBuildGradle.match(/^ *compileSdk (\d+)$/m)?.[1]).toBe(
        String(COMPILE_SDK),
      );
      expect(moduleBuildGradle.match(/^ *compileSdkMinor (\d+)$/m)?.[1]).toBe(
        String(COMPILE_SDK_MINOR),
      );
    });
  });

  describe('config plugin', () => {
    test('updates gradle.properties and the app build.gradle', () => {
      const files = prebuild(withNutrientAndroidToolchain(expoConfig()));
      expect(files.gradleProperties).toContainEqual(kotlinProperty('2.4.10'));
      expect(files.appBuildGradle.contents).toContain(COMPILE_SDK_MINOR_BLOCK);
    });

    test('leaves a Kotlin script build.gradle.kts unchanged and warns', () => {
      const appBuildGradle = {
        language: 'kt',
        contents: 'android {\n    compileSdk = 37\n}\n',
      };
      const files = prebuild(
        withNutrientAndroidToolchain(expoConfig()),
        appBuildGradle,
      );
      expect(files.appBuildGradle).toEqual(appBuildGradle);
      expect(files.gradleProperties).toContainEqual(kotlinProperty('2.4.10'));
      expect(warn.mock.calls.map(call => call[0])).toContainEqual(
        expect.stringContaining('is not Groovy'),
      );
    });

    test('is applied by the package plugin together with the theme', () => {
      const files = prebuild(withNutrient(expoConfig()));
      expect(files.styles.resources.style[0].$.parent).toBe(
        '@style/NutrientRN.AppTheme',
      );
      expect(files.gradleProperties).toContainEqual(kotlinProperty('2.4.10'));
      expect(files.appBuildGradle.contents).toContain(COMPILE_SDK_MINOR_BLOCK);
    });

    test('raises an older Kotlin version from a plugin listed after it', () => {
      const config = withKotlinVersion(withNutrient(expoConfig()), '2.2.10');
      expect(prebuild(config).gradleProperties).toContainEqual(
        kotlinProperty('2.4.10'),
      );
    });

    test('is overwritten by an older Kotlin version from a plugin listed before it', () => {
      const config = withNutrient(withKotlinVersion(expoConfig(), '2.2.10'));
      expect(prebuild(config).gradleProperties).toContainEqual(
        kotlinProperty('2.2.10'),
      );
    });
  });
});
