import { reactNativeVitestPlugin } from "react-native-testing-mocks/vitest";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [reactNativeVitestPlugin()],
  test: {
    include: ["test/**/*.test.ts?(x)"],
    setupFiles: "./test/setup.ts",
  },
});
