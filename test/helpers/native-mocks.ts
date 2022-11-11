import * as React from "react";
import {
  Animated,
  MeasureInWindowOnSuccessCallback,
  NativeMethods,
} from "react-native";

import { MeasureOnSuccessCallbackParams } from "./measures";

export function mockNativeComponent(modulePath: string, mockMethods: NativeMethods) {
  const OriginalComponent = jest.requireActual(modulePath);
  const SuperClass = typeof OriginalComponent === "function"
      ? OriginalComponent
      : React.Component;

  const Component = class extends SuperClass {
    public static displayName: string = "Component";

    public render() {
      const name: string =
        OriginalComponent.displayName ||
        OriginalComponent.name ||
        (OriginalComponent.render
          ? OriginalComponent.render.displayName ||
            OriginalComponent.render.name
          : "Unknown");

      const props = Object.assign({}, OriginalComponent.defaultProps);

      if (this.props) {
        Object.keys(this.props).forEach(prop => {
          if (this.props[prop] !== undefined) {
            props[prop] = this.props[prop];
          }
        });
      }

      return React.createElement(name.replace(/^(RCT|RK)/, ""), props, this.props.children);
    }
  };

  Object.keys(OriginalComponent).forEach(classStatic => {
    Component[classStatic] = OriginalComponent[classStatic];
  });

  Object.assign(Component.prototype, mockMethods);

  return Component;
}

export const emptyNativeMethods: NativeMethods = {
  blur: jest.fn(),
  focus: jest.fn(),
  measure: jest.fn(),
  measureInWindow: jest.fn(),
  measureLayout: jest.fn(),
  refs: {},
  setNativeProps: jest.fn(),
};

export function createMeasureMethod(
  mockMeasureData: MeasureOnSuccessCallbackParams,
): (callback: MeasureInWindowOnSuccessCallback) => void {
  return callback => {
    const { x, y, width, height } = mockMeasureData;
    callback(x, y, width, height);
  };
}

export const emptyAnimationMethods: Animated.CompositeAnimation = {
  reset: () => undefined,
  start: () => undefined,
  stop: () => undefined,
};
