import React, { memo, useEffect, useMemo, useRef } from "react";
import isEqual from "react-fast-compare";
import { Animated } from "react-native";
import { Circle } from "react-native-svg";

import { ShapeProps, transitionOf } from "../../../../helpers/shape";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const CircleShape = memo<ShapeProps>(props => {
  const { motion, padding, setReference, spot, useNativeDriver } = props;

  const r = useMemo((): number => {
    return Math.max(spot.width, spot.height) / 2 + padding;
  }, [spot.width, spot.height, padding]);

  const x = useMemo((): number => {
    return spot.x + spot.width / 2;
  }, [spot.x, spot.width]);

  const y = useMemo((): number => {
    return spot.y + spot.height / 2;
  }, [spot.y, spot.height]);

  const center = useRef(new Animated.ValueXY({ x, y }, { useNativeDriver }));
  const radius = useRef(new Animated.Value(r, { useNativeDriver }));
  const opacity = useRef(new Animated.Value(0, { useNativeDriver }));

  useEffect(() => {
    const transition = transitionOf({
      motion,
      nextOrigin: { x, y },
      nextSize: r,
      opacity,
      origin: center,
      size: radius,
      useNativeDriver,
    });

    transition.start();

    setReference({
      measure: callback => {
        const r2 = r * 2;
        callback(x - r, y - r, r2, r2);
      },
    });

    return () => setReference(undefined);
  }, [r, x, y, setReference, motion, useNativeDriver]);

  if ([spot.height, spot.width].every(value => value <= 0)) {
    return null;
  }

  return (
    <>
      <AnimatedCircle
        r={radius.current}
        cx={center.current.x}
        cy={center.current.y}
        opacity={opacity.current}
        fill="black"
      />
    </>
  );
}, isEqual);
