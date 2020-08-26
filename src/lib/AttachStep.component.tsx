import React, { ClassAttributes, isValidElement, useContext, useEffect, useRef } from "react";
import { StyleProp, View, ViewProps, ViewStyle } from "react-native";

import { SpotlightTourContext } from "./SpotlightTour.context";

interface AttachStepProps {
  index: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const AttachStep: React.FC<AttachStepProps> = ({ children, disabled, index, style }) => {
  const { current, changeSpot, spot } = useContext(SpotlightTourContext);

  const childRef = useRef<View>(null);

  useEffect(() => {
    if (!disabled && current === index) {
      if (!spot) {
        changeSpot({ height: 0, width: 0, x: 0, y: 0 });
      }

      childRef.current?.measureInWindow((x, y, width, height) => {
        changeSpot({ height, width, x, y });
      });
    }
  }, [current, disabled]);

  if (isValidElement(children) && React.Children.count(children) === 1) {
    return React.cloneElement<ClassAttributes<View> & ViewProps>(
      React.Children.only(children),
      { ref: childRef, collapsable: false }
    );
  }

  return (
    <View ref={childRef} collapsable={false} style={style}>
      {children}
    </View>
  );
};
