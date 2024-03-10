/* eslint-disable react-hooks/rules-of-hooks */
import Sinon from "sinon";

export function mochaHooks(): Mocha.RootHookObject {
  return {
    afterEach() {
      Sinon.restore();
    },
    beforeEach() {
      Sinon.useFakeTimers({
        advanceTimeDelta: 0,
        shouldAdvanceTime: true,
      });
    },
  };
}
