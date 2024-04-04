import React, { cloneElement, ReactElement, ReactNode, RefObject, useContext, useEffect, useRef } from "react";
import { StyleProp, View } from "react-native";

import { SpotlightTourContext } from "../../SpotlightTour.context";

export interface ChildProps<T> {
  /**
   * A React children, if any.
   */
  children?: ReactNode;
  /**
   * A React reference.
   */
  ref: RefObject<unknown>;
  /**
   * The style prop.
   */
  style: StyleProp<T>;
}

export interface AttachStepProps<T> {
  /**
   * The element in which the spotlight will be to wrapped to in the specified
   * step of the tour.
   */
  children: ReactElement<ChildProps<T>>;
  /**
   * When `AttachStep` wraps a Functional Component, it needs to add an
   * additional `View` on top of it to be able to measure the layout upon
   * render. This prop allows to define the behavior of the width of such
   * `View`. When set to `false`, it adjusts to its contents, when set to
   * `true`, it stretches out and tries to fill it view.
   *
   * **Note:** This property has no effect when it's applied to native
   * components or components created using `React.forwardRef`, which pass
   * the `ref` to another native component.
   *
   * @default false
   */
  fill?: boolean;
  /**
   * The index of the `steps` array to which the step is attached to.
   * It can be a single index or multiple ones.
   */
  index: number | Array<number>;
}

/**
 * React functional component used to attach and step to another component by
 * only wrapping it. Use its props to customize the behavior.
 *
 * @param props the component props
 * @returns an AttachStep React element
 */
export function AttachStep<T>({ children, fill = false, index }: AttachStepProps<T>): ReactElement {
  const { current, changeSpot } = useContext(SpotlightTourContext);

  const childRef = useRef<View>(null);

  useEffect(() => {
    if (checkIndex(index, current)) {
      childRef.current?.measureInWindow((x, y, width, height) => {
        changeSpot({ height, width, x, y });
      });
    }
  }, [changeSpot, current, index.toString()]);

  if (typeof children.type === "function") {
    const { style, ...rest } = children.props;
    const childStyle = style ?? { };

    return (
      <View
        testID="attach-wrapper-view"
        ref={childRef}
        style={{ alignSelf: fill ? "stretch" : "flex-start", ...childStyle }}
        collapsable={false}
        focusable={false}
      >
        {cloneElement(
          children,
          rest,
          children.props.children,
        )}
      </View>
    );
  }

  return cloneElement(
    children,
    { ...children.props, ref: childRef },
    children.props?.children,
  );
}

function checkIndex<T>(index: AttachStepProps<T>["index"], current: number | undefined): boolean {
  if (current === undefined) {
    return false;
  }

  if (Array.isArray(index)) {
    return index.includes(current);
  }

  return current === index;
}
