import { Animated } from "react-native";

import {
  createMeasureMethod,
  emptyAnimationMethods,
  emptyNativeMethods,
  mockNativeComponent
} from "./test/mock.utils/mock.native.component";

export type MeasureOnSuccessCallbackParams = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const viewMockMeasureData: MeasureOnSuccessCallbackParams = {
  height: 400,
  width: 200,
  x: 1,
  y: 1
};

export const buttonMockMeasureData: MeasureOnSuccessCallbackParams = {
  height: 50,
  width: 100,
  x: 10,
  y: 10
};

jest
  .mock("react-native/Libraries/Components/View/View", () => {
    return mockNativeComponent("react-native/Libraries/Components/View/View", {
      ...emptyNativeMethods,
      measureInWindow: createMeasureMethod(viewMockMeasureData)
    });
  })
  .mock("react-native/Libraries/Components/Button", () => {
    return mockNativeComponent("react-native/Libraries/Components/Button", {
      ...emptyNativeMethods,
      measureInWindow: createMeasureMethod(buttonMockMeasureData)
    });
  })
  .doMock("react-native/Libraries/Animated/src/AnimatedImplementation", () => {
    const ActualAnimated = jest.requireActual(
      "react-native/Libraries/Animated/src/AnimatedImplementation"
    );

    const timingMock = (
      value: Animated.Value | Animated.ValueXY,
      config: Animated.TimingAnimationConfig
    ): Animated.CompositeAnimation => {
      const anyValue: any = value;

      return {
        ...emptyAnimationMethods,
        start: (callback?: Animated.EndCallback) => {
          anyValue.setValue(config.toValue);
          callback && callback({ finished: true });
        }
      };
    };

    const springMock = (
      value: Animated.Value | Animated.ValueXY,
      config: Animated.SpringAnimationConfig
    ) => {
      const anyValue: any = value;

      return {
        ...emptyAnimationMethods,
        start: (callback?: Animated.EndCallback): void => {
          anyValue.setValue(config.toValue);
          callback && callback({ finished: true });
        }
      };
    };

    return {
      ...ActualAnimated,
      spring: springMock,
      timing: timingMock
    };
  });
