
import React, { ReactElement, useCallback, useContext, useLayoutEffect, useRef } from "react";
import { LayoutChangeEvent, View } from "react-native";

import { SpotlightTourContext } from "./SpotlightTour.context";

interface AttachStepProps {
  children: ReactElement;
  disabled?: boolean;
  index: number;
}

export function AttachStep({ children, disabled, index }: AttachStepProps): ReactElement {
  const { current, changeSpot, spot } = useContext(SpotlightTourContext);

  const childRef = useRef<View>(null);

  const adjustSpotToView = useCallback((): void => {
    childRef.current?.measureInWindow((x, y, width, height) => {
      changeSpot({ height, width, x, y });
    });
  }, [childRef]);

  useLayoutEffect(() => {
    if (!spot) {
      changeSpot({ height: 0, width: 0, x: 0, y: 0 });
    }

    if (!disabled && current === index) {
      adjustSpotToView();
    }
  }, [current, disabled]);

  const onLayout = (event: LayoutChangeEvent): void => {
    if (spot && !disabled && current === index) {
      adjustSpotToView();
    }

    children.props?.onLayout?.(event);
  };

  return React.cloneElement(
    children,
    { ...children.props, onLayout, ref: childRef },
    children.props?.children
  );
}
