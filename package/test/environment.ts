import "react-native-testing-mocks/register";

import type { Environment } from "vitest/environments";

/**
 * Replacement for the `react-native-testing-mocks/vitest` environment, which
 * relies on `transformMode` (removed in Vitest 4) and whose CJS build is not
 * unwrapped correctly by Vitest 4's module runner.
 */
export default {
  name: "react-native",
  setup: () => ({ teardown: () => undefined }),
  viteEnvironment: "ssr",
} satisfies Environment;
