import React, { ComponentClass, memo, useContext, useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Circle, CircleProps } from "react-native-svg";

import { Motion, SpotlightTourContext } from "../../../SpotlightTour.context";

interface CircleShapeProps {
  motion: Motion;
  useNativeDriver: boolean;
}

const AnimatedCircle = Animated.createAnimatedComponent<ComponentClass<CircleProps>>(Circle);

export const CircleShape = memo<CircleShapeProps>(({ motion, useNativeDriver }) => {
  const { spot } = useContext(SpotlightTourContext);

  const center = useRef(new Animated.ValueXY({ x: 0, y: 0 }, { useNativeDriver })).current;
  const opacity = useRef(new Animated.Value(0, { useNativeDriver })).current;
  const radius = useRef(new Animated.Value(0, { useNativeDriver })).current;

  useEffect(() => {
    const { height, width, x, y } = spot;
    const r = (Math.max(width, height) / 2) * 1.15;
    const cx = x + (width / 2);
    const cy = y + (height / 2);

    const transition = (): Animated.CompositeAnimation => {
      switch (motion) {
        case Motion.FADE:
          return Animated.sequence([
            Animated.timing(opacity, {
              duration: 300,
              toValue: 0,
              useNativeDriver,
            }),
            Animated.parallel([
              Animated.timing(center, {
                duration: 0,
                toValue: { x: cx, y: cy },
                useNativeDriver,
              }),
              Animated.timing(radius, {
                duration: 0,
                toValue: r,
                useNativeDriver,
              }),
            ]),
            Animated.timing(opacity, {
              duration: 300,
              toValue: 1,
              useNativeDriver,
            }),
          ]);

        case Motion.SLIDE:
          return Animated.parallel([
            Animated.timing(opacity, {
              toValue: 1,
              useNativeDriver,
            }),
            Animated.spring(center, {
              damping: 50,
              mass: 5,
              stiffness: 300,
              toValue: { x: cx, y: cy },
              useNativeDriver,
            }),
            Animated.spring(radius, {
              damping: 30,
              mass: 5,
              stiffness: 300,
              toValue: r,
              useNativeDriver,
            }),
          ]);
      }
    };

    transition().start();
  }, [center, motion, opacity, radius, spot, useNativeDriver]);

  return (
    <AnimatedCircle
      r={radius}
      cx={center.x}
      cy={center.y}
      opacity={opacity}
      fill="black"
    />
  );
}, (prev, next) => prev.motion === next.motion);
