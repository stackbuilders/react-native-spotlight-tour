import React, { ComponentClass, ReactElement } from "react";
import { Animated } from "react-native";
import { Circle, CircleProps } from "react-native-svg";

import { useCircleMotion } from "../../../hooks/useCircleMotion.hook";
import { Motion } from "../../../SpotlightTour.context";

interface CircleShapeProps {
  motion: Motion;
  useNativeDriver: boolean;
}

const AnimatedCircle = Animated.createAnimatedComponent<ComponentClass<CircleProps>>(Circle);

export function CircleShape(props: CircleShapeProps): ReactElement {
  const { center, opacity, radius } = useCircleMotion(props);

  return (
    <AnimatedCircle
      r={radius}
      cx={center.x}
      cy={center.y}
      opacity={opacity}
      fill="black"
    />
  );
}
