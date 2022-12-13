import { useContext, useLayoutEffect, useMemo, useRef } from "react";
import { Animated } from "react-native";

import { Motion, SpotlightTourContext } from "../SpotlightTour.context";

interface CircleValues {
  center: Animated.ValueXY;
  opacity: Animated.Value;
  radius: Animated.Value;
}

interface UseMotionOptions {
  motion: Motion;
  useNativeDriver: boolean;
}

export function useCircleMotion({ motion, useNativeDriver }: UseMotionOptions): CircleValues {
  const { spot } = useContext(SpotlightTourContext);

  const center = useRef(new Animated.ValueXY({ x: 0, y: 0 }, { useNativeDriver })).current;
  const opacity = useRef(new Animated.Value(0, { useNativeDriver })).current;
  const radius = useRef(new Animated.Value(0, { useNativeDriver })).current;

  const transition = useMemo((): Animated.CompositeAnimation => {
    const r = (Math.max(spot.width, spot.height) / 2) * 1.15;
    const cx = spot.x + (spot.width / 2);
    const cy = spot.y + (spot.height / 2);

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
            useNativeDriver: true,
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
  }, [spot]);

  useLayoutEffect(() => {
    transition.start();
  }, [transition]);

  return { center, opacity, radius };
}
