import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { SpotlightTourContext } from "./SpotlightTour.context";

interface AttachStepProps {
  index: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const AttachStep: React.FC<AttachStepProps> = ({ children, disabled, index, style, }) => {

  const [ childStyle, setChildStyle ] = useState({});
  const { current, changeSpot, spot } = useContext(SpotlightTourContext);

  const childRef = useRef<View>(null);

  const componentStyle = useMemo<StyleProp<ViewStyle>>(
    () => [ childStyle, style ],
    []
  );

  useEffect(() => {
    if (!spot) {
      changeSpot({ height: 0, width: 0, x: 0, y: 0 });
      setChildStyle({ height: 0, width: 0 });
    }

    if (!disabled && current === index) {
      childRef.current?.measureInWindow((x, y, width, height) => {
        changeSpot({ height, width, x, y });
        setChildStyle({ height, width });
      });
    }
  }, [current, disabled]);

  return (
    <View ref={childRef} collapsable={false} style={componentStyle}>
      {children}
    </View>
  );
};
