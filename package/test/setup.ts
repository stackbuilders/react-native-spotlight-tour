/* eslint-disable max-classes-per-file */
import { Animated, LayoutRectangle } from "react-native";

import {
  isAnimatedTimingInterpolation,
  isAnimatedValue,
  isAnimatedValueXY,
  isNumberValue,
  isXYValue,
} from "./helpers/helper";
import {
  emptyAnimationMethods,
  emptyNativeMethods,
  mockNativeComponent,
} from "./helpers/nativeMocks";

global.context = describe;

const REACT: LayoutRectangle = {
  height: 400,
  width: 200,
  x: 1,
  y: 1,
};

export function setMeasureRect({ height, width, x, y }: LayoutRectangle): void {
  REACT.height = height;
  REACT.width = width;
  REACT.x = x;
  REACT.y = y;
}

jest
  .mock("react-native/Libraries/Components/View/View", () => {
    return mockNativeComponent("react-native/Libraries/Components/View/View", {
      ...emptyNativeMethods,
      measureInWindow: callback => {
        const { height, width, x, y } = REACT;
        callback(x, y, width, height);
      },
    });
  })
  .mock("react-native/Libraries/Animated/nodes/AnimatedValue.js", () => {
    const ActualValue = jest.requireActual<{ default: typeof Animated.Value; }>(
      "react-native/Libraries/Animated/nodes/AnimatedValue.js",
    ).default;

    class MockedValue extends ActualValue {

      public constructor(value: number) {
        super(value);
      }
    }

    return {
      __esModule: true,
      default: MockedValue,
    };
  })
  .mock("react-native/Libraries/Animated/nodes/AnimatedValueXY.js", () => {
    const ActualValueXY = jest.requireActual<{ default: typeof Animated.ValueXY; }>(
      "react-native/Libraries/Animated/nodes/AnimatedValueXY.js",
    ).default;

    class MockedValue extends ActualValueXY {

      public constructor(valueIn: { x: number | Animated.Value; y: number | Animated.Value; }) {
        super(valueIn);
      }
    }

    return {
      __esModule: true,
      default: MockedValue,
    };
  })
  .mock("react-native/Libraries/Animated/AnimatedImplementation", () => {
    const ActualAnimated = jest.requireActual<{ default: Animated.Animated; }>(
      "react-native/Libraries/Animated/AnimatedImplementation",
    ).default;

    const timingMock = (
      value: Animated.Value | Animated.ValueXY,
      config: Animated.TimingAnimationConfig,
    ): Animated.CompositeAnimation => {

      return {
        ...emptyAnimationMethods,
        start(callback) {
          if (
            isAnimatedValueXY(value)
              && !isAnimatedTimingInterpolation(config.toValue)
              && isXYValue(config.toValue)
          ) {
            value.setValue(config.toValue);
          }

          if (
            isAnimatedValue(value)
              && !isAnimatedTimingInterpolation(config.toValue)
              && isNumberValue(config.toValue)
          ) {
            value.setValue(config.toValue);
          }

          callback?.({ finished: true });
        },
      };
    };

    const springMock = (
      value: Animated.Value | Animated.ValueXY,
      config: Animated.SpringAnimationConfig,
    ): Animated.CompositeAnimation => {
      return {
        ...emptyAnimationMethods,
        start(callback) {
          if (isAnimatedValueXY(value) && isXYValue(config.toValue)) {
            value.setValue(config.toValue);
          }

          if (isAnimatedValue(value) && isNumberValue(config.toValue)) {
            value.setValue(config.toValue);
          }

          callback?.({ finished: true });
        },
      };
    };

    return {
      __esModule: true,
      default: {
        ...ActualAnimated,
        spring: springMock,
        timing: timingMock,
      },
    };
  });

afterEach(() => {
  jest.resetAllMocks();
  setMeasureRect({
    height: 400,
    width: 200,
    x: 1,
    y: 1,
  });
});
