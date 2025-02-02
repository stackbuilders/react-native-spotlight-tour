/**
 * @type {import('@babel/core').TransformOptions}
 */
module.exports = {
  // added reanimated plugin
  // https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started#step-2-add-reanimateds-babel-plugin
  plugins: [
    // '@babel/plugin-proposal-export-namespace-from', // -> reanimated for web support
    "react-native-paper/babel", // Bundle excluding modules you don't use: https://callstack.github.io/react-native-paper/docs/guides/getting-started
    "react-native-reanimated/plugin",
  ],
  presets: ["@rnx-kit/babel-preset-metro-react-native"],
};
