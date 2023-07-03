import { deepEqual } from "fast-equals";
import React, { memo, useContext, useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Circle } from "react-native-svg";

import { Motion, SpotlightTourContext } from "../../../SpotlightTour.context";

interface CircleShapeProps {
  motion: Motion;
  padding: number;
  useNativeDriver: boolean;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const CircleShape = memo<CircleShapeProps>(({ motion, padding, useNativeDriver }) => {
  const { spot } = useContext(SpotlightTourContext);

  const center = useRef(new Animated.ValueXY({ x: 0, y: 0 }, { useNativeDriver }));
  const opacity = useRef(new Animated.Value(0, { useNativeDriver }));
  const radius = useRef(new Animated.Value(0, { useNativeDriver }));

  useEffect(() => {
    const { height, width, x, y } = spot;
    const r = (Math.max(width, height) / 2) + padding;
    const cx = x + (width / 2);
    const cy = y + (height / 2);

    const transition = (): Animated.CompositeAnimation => {
      switch (motion) {
        case "bounce":
          opacity.current.setValue(1);

          return Animated.parallel([
            Animated.spring(center.current, {
              damping: 45,
              mass: 4,
              stiffness: 350,
              toValue: { x: cx, y: cy },
              useNativeDriver,
            }),
            Animated.spring(radius.current, {
              damping: 35,
              mass: 4,
              stiffness: 350,
              toValue: r,
              useNativeDriver,
            }),
          ]);

        case "fade":
          return Animated.sequence([
            Animated.timing(opacity.current, {
              duration: 400,
              toValue: 0,
              useNativeDriver,
            }),
            Animated.parallel([
              Animated.timing(center.current, {
                duration: 0,
                toValue: { x: cx, y: cy },
                useNativeDriver,
              }),
              Animated.timing(radius.current, {
                duration: 0,
                toValue: r,
                useNativeDriver,
              }),
            ]),
            Animated.timing(opacity.current, {
              duration: 400,
              toValue: 1,
              useNativeDriver,
            }),
          ]);

        case "slide":
          opacity.current.setValue(1);

          return Animated.parallel([
            Animated.timing(center.current, {
              duration: 400,
              toValue: { x: cx, y: cy },
              useNativeDriver,
            }),
            Animated.timing(radius.current, {
              duration: 400,
              toValue: r,
              useNativeDriver,
            }),
          ]);
      }
    };

    transition().start();
  }, [spot, padding, motion, useNativeDriver]);

  if ([spot.height, spot.width].every(value => value <= 0)) {
    return null;
  }

  return (
    <AnimatedCircle
      r={radius.current}
      cx={center.current.x}
      cy={center.current.y}
      opacity={opacity.current}
      fill="black"
    />
  );
}, deepEqual);
