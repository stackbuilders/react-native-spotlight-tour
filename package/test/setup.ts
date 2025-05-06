import { usePlugin } from "@assertive-ts/core";
import { SinonPlugin } from "@assertive-ts/sinon";
import { cleanup } from "@testing-library/react-native";
import Sinon from "sinon";
import { afterEach } from "vitest";

usePlugin(SinonPlugin);

afterEach(() => {
  Sinon.reset();
  Sinon.resetBehavior();
  Sinon.resetHistory();
  Sinon.restore();
  cleanup();
});
