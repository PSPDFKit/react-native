const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// The Nutrient SDK package (file:../..) is symlinked into node_modules in the
// monorepo dev setup, so Metro must index the package root explicitly and
// resolve the SDK's own dependencies from the Catalog's node_modules.
const sdkRoot = path.resolve(__dirname, '..', '..');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  watchFolders: [sdkRoot],
  resolver: {
    // The SDK root .watchmanconfig ignores samples/, which hides the Catalog
    // from any watchman crawl rooted there; use Metro's node crawler instead.
    useWatchman: false,
    nodeModulesPaths: [path.resolve(__dirname, 'node_modules')],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
