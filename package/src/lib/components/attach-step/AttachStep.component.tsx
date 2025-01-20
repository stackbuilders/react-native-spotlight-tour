import React, {
  ReactElement,
  ReactNode,
  RefObject,
  cloneElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { LayoutChangeEvent, StyleProp, View, ViewStyle } from "react-native";

import { SpotlightTourContext } from "../../SpotlightTour.context";

export interface ChildProps {
  /**
   * A React children, if any.
   */
  children?: ReactNode;
  /**
   * Native components layout change event.
   *
   * @param event The layout event.
   */
  onLayout?: (event: LayoutChangeEvent) => void;
  /**
   * A React reference.
   */
  ref: RefObject<unknown>;
}

export interface AttachStepProps {
  /**
   * The element in which the spotlight will be to wrapped to in the specified
   * step of the tour.
   */
  children: ReactElement<ChildProps>;
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
  /**
   * Style applied to AttachStep wrapper
   */
  style?: StyleProp<ViewStyle>
}

/**
 * React functional component used to attach and step to another component by
 * only wrapping it. Use its props to customize the behavior.
 *
 * @param props the component props
 * @returns an AttachStep React element
 */
export function AttachStep({ children, fill = false, index, style }: AttachStepProps): ReactElement {
  const { current, changeSpot } = useContext(SpotlightTourContext);

  const ref = useRef<View>(null);

  const updateSpot = useCallback((): void => {
    const indexes = typeof index === "number" ? [index] : index;

    if (current !== undefined && indexes.includes(current)) {
      ref.current?.measureInWindow((x, y, width, height) => {
        changeSpot({ height, width, x, y });
      });
    }
  }, [changeSpot, current, JSON.stringify(index)]);

  const onLayout = useCallback((event: LayoutChangeEvent): void => {
    updateSpot();
    children.props.onLayout?.(event);
  }, [updateSpot, children.props.onLayout]);

  useEffect(() => {
    updateSpot();
  }, [updateSpot]);

  return (
    <View
      testID="attach-wrapper-view"
      ref={ref}
      style={[{ alignSelf: fill ? "stretch" : "flex-start"}, style]}
      collapsable={false}
      focusable={false}
      onLayout={onLayout}
    >
      {cloneElement(
        children,
        children.props,
        children.props.children,
      )}
    </View>
  );
}
