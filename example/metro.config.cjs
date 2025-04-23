const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const { makeMetroConfig } = require("@rnx-kit/metro-config");
const MetroSymlinksResolver = require("@rnx-kit/metro-resolver-symlinks");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import("metro-config").MetroConfig}
 */
const config = makeMetroConfig({
  resolver: {
    resolveRequest: MetroSymlinksResolver(),
  },
});

// may need to wrap metro config with reanimated wrapper
// https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started#step-3-wrap-metro-config-with-reanimated-wrapper-recommended
module.exports = wrapWithReanimatedMetroConfig(
  mergeConfig(getDefaultConfig(__dirname), config),
);
