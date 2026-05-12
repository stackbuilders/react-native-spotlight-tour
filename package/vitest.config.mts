import { reactNativeVitestPlugin } from "react-native-testing-mocks/vitest";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [reactNativeVitestPlugin()],
  test: {
    deps: {
      inline: ["dot-prop-immutable", "react-native-testing-mocks"],
      interopDefault: true,
    },
    include: ["test/**/*.test.ts?(x)"],
    setupFiles: "./test/setup.ts",
  },
});
