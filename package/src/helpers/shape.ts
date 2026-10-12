import { Animated, type LayoutRectangle, type MeasureInWindowOnSuccessCallback } from "react-native";

import type { Motion } from "../lib/SpotlightTour.context";

interface RefNode {
  measure: (callback: MeasureInWindowOnSuccessCallback) => void;
}

export interface ShapeProps {
  borderRadius: number;
  motion: Motion;
  padding: number;
  setReference: (node?: RefNode) => void;
  spot: LayoutRectangle;
  useNativeDriver: boolean;
}

interface Point {
  x: number;
  y: number;
}

interface BaseTransitionOptions {
  motion: Motion;
  nextOrigin: Point;
  opacity: Animated.Value;
  origin: Animated.ValueXY;
  useNativeDriver: boolean;
}

interface ValueTransitionOptions extends BaseTransitionOptions {
  nextSize: number;
  size: Animated.Value;
}

interface PointTransitionOptions extends BaseTransitionOptions {
  nextSize: Point;
  size: Animated.ValueXY;
}

type TransitionOptions = PointTransitionOptions | ValueTransitionOptions;

export function transitionOf(options: TransitionOptions): Animated.CompositeAnimation {
  const {
    motion,
    nextOrigin,
    nextSize,
    opacity,
    origin,
    size,
    useNativeDriver,
  } = options;

  switch (motion) {
    case "bounce":
      opacity.setValue(1);

      return Animated.parallel([
        Animated.spring(origin, {
          damping: 45,
          mass: 4,
          restDisplacementThreshold: 0.0875,
          restSpeedThreshold: 1000,
          stiffness: 350,
          toValue: nextOrigin,
          useNativeDriver,
        }),
        Animated.spring(size, {
          damping: 45,
          mass: 4,
          restDisplacementThreshold: 0.0875,
          restSpeedThreshold: 1000,
          stiffness: 350,
          toValue: nextSize,
          useNativeDriver,
        }),
      ]);

    case "fade":
      return Animated.sequence([
        Animated.timing(opacity, {
          duration: 400,
          toValue: 0,
          useNativeDriver,
        }),
        Animated.parallel([
          Animated.timing(origin, {
            duration: 0,
            toValue: nextOrigin,
            useNativeDriver,
          }),
          Animated.timing(size, {
            duration: 0,
            toValue: nextSize,
            useNativeDriver,
          }),
        ]),
        Animated.timing(opacity, {
          duration: 400,
          toValue: 1,
          useNativeDriver,
        }),
      ]);

    case "slide":
      opacity.setValue(1);

      return Animated.parallel([
        Animated.timing(origin, {
          duration: 400,
          toValue: nextOrigin,
          useNativeDriver,
        }),
        Animated.timing(size, {
          duration: 400,
          toValue: nextSize,
          useNativeDriver,
        }),
      ]);
  }
}
