import { Component, ComponentClass, createElement, forwardRef, PropsWithChildren, ReactNode } from "react";
import { Animated, NativeMethods } from "react-native";

type Comp = ReturnType<typeof forwardRef> | ComponentClass;

export function mockNativeComponent<T extends Comp>(modulePath: string, mockMethods: NativeMethods): T {
  const OriginalComponent = jest.requireActual<T>(modulePath);

  const name = OriginalComponent.displayName ?? OriginalComponent.name;

  const Mocked = class Other<X> extends Component<PropsWithChildren<X>> {
    public static displayName = OriginalComponent.displayName;

    public constructor(props: PropsWithChildren<X>) {
      super(props);
    }

    public render(): ReactNode {
      return createElement(
        name.replace(/^(RCT|RK)/, ""),
        this.props,
        this.props.children,
      );
    }
  };

  Object.assign(Mocked.prototype, mockMethods);

  return Mocked as T;
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

export const emptyAnimationMethods: Animated.CompositeAnimation = {
  reset: () => undefined,
  start: () => undefined,
  stop: () => undefined,
};
