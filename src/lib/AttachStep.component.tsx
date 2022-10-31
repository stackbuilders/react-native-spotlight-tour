
import React, { ReactElement, useContext, useLayoutEffect, useRef } from "react";
import { View } from "react-native";

import { SpotlightTourContext } from "./SpotlightTour.context";

interface AttachStepProps {
  children: ReactElement;
  disabled?: boolean;
  index: number;
}

export function AttachStep({ children, disabled, index }: AttachStepProps): ReactElement {
  const { current, changeSpot } = useContext(SpotlightTourContext);

  const childRef = useRef<View>(null);

  useLayoutEffect(() => {
    if (!disabled && current === index) {
      childRef.current?.measureInWindow((x, y, width, height) => {
        changeSpot({ height, width, x, y });
      });
    }
  }, [current]);

  return React.cloneElement(
    children,
    { ...children.props, ref: childRef },
    children.props?.children
  );
}
