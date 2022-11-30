import { Animated } from "react-native";

import {
  isAnimatedTimingInterpolation,
  isAnimatedValue,
  isAnimatedValueXY,
  isNumberValue,
  isXYValue,
} from "./helpers/helper";
import { buttonMockMeasureData, viewMockMeasureData } from "./helpers/measures";
import {
  createMeasureMethod,
  emptyAnimationMethods,
  emptyNativeMethods,
  mockNativeComponent,
} from "./helpers/native-mocks";

global.context = describe;

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper")
  .mock("react-native/Libraries/Components/View/View", () => {
    return mockNativeComponent("react-native/Libraries/Components/View/View", {
      ...emptyNativeMethods,
      measureInWindow: createMeasureMethod(viewMockMeasureData),
    });
  })
  .mock("react-native/Libraries/Components/Button", () => {
    return mockNativeComponent("react-native/Libraries/Components/Button", {
      ...emptyNativeMethods,
      measureInWindow: createMeasureMethod(buttonMockMeasureData),
    });
  })
  .doMock("react-native/Libraries/Animated/AnimatedImplementation", () => {
    const ActualAnimated = jest.requireActual<Animated.Animated>(
      "react-native/Libraries/Animated/AnimatedImplementation",
    );

    const timingMock = (
      value: Animated.Value | Animated.ValueXY,
      config: Animated.TimingAnimationConfig,
    ): Animated.CompositeAnimation => {

      return {
        ...emptyAnimationMethods,
        start(callback) {
          if (
            isAnimatedValueXY(value) &&
            !isAnimatedTimingInterpolation(config.toValue) &&
            isXYValue(config.toValue)
          ) {
            value.setValue(config.toValue);
          } else if (
            isAnimatedValue(value) &&
            !isAnimatedTimingInterpolation(config.toValue) &&
            isNumberValue(config.toValue)
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
          } else if (isAnimatedValue(value) && isNumberValue(config.toValue)) {
            value.setValue(config.toValue);
          }

          callback?.({ finished: true });
        },
      };
    };

    return {
      ...ActualAnimated,
      spring: springMock,
      timing: timingMock,
    };
  });

afterEach(() => {
  jest.resetAllMocks();
});
