const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const { makeMetroConfig } = require("@rnx-kit/metro-config");
const MetroSymlinksResolver = require("@rnx-kit/metro-resolver-symlinks");

const reactNativeWebPath = require.resolve("react-native-web");

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import("metro-config").MetroConfig}
 */
const config = makeMetroConfig({
  resolver: {
    extraNodeModules: {
      "react-native": reactNativeWebPath,
      "react-native-web": reactNativeWebPath,
    },
    platforms: ["ios", "android", "web"],
    resolveRequest: MetroSymlinksResolver(),
  },
});

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
