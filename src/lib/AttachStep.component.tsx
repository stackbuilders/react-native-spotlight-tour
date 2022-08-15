import React, { ReactElement, ReactNode, useContext, useEffect, useRef } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import styled from "styled-components/native";

import { SpotlightTourContext } from "./SpotlightTour.context";

interface AttachStepProps {
  children: ReactNode;
  disabled?: boolean;
  index: number;
  style?: StyleProp<ViewStyle>;
}

const StepView = styled.View`
  align-self: flex-start;
`;

export function AttachStep({ children, disabled, index, style }: AttachStepProps): ReactElement {
  const { current, changeSpot, spot } = useContext(SpotlightTourContext);

  const childRef = useRef<View>(null);

  useEffect(() => {
    if (!spot) {
      changeSpot({ height: 0, width: 0, x: 0, y: 0 });
    }

    if (!disabled && current === index) {
      childRef.current?.measureInWindow((x, y, width, height) => {
        changeSpot({ height, width, x, y });
      });
    }
  }, [current, disabled]);

  return (
    <StepView ref={childRef} collapsable={false} style={style}>
      {children}
    </StepView>
  );
}
