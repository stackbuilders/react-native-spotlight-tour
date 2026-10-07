import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "./test/environment.ts",
    execArgv: ["--no-experimental-detect-module"],
    globals: true,
    include: ["test/**/*.test.ts?(x)"],
    server: {
      deps: {
        external: ["react-native", "@react-native"],
      },
    },
    setupFiles: "./test/setup.ts",
  },
});
