/**
 * @type {import('@babel/core').TransformOptions}
 */
module.exports = {
  plugins: [
    [
      "@babel/plugin-transform-react-jsx",
      {
        runtime: "automatic",
      },
    ],
  ],
  presets: [
    ["@rnx-kit/babel-preset-metro-react-native", { useTransformReactJSXExperimental: true }],
  ],
};
