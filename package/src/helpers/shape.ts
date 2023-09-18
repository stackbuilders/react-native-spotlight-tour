import { MutableRefObject } from "react";
import { Animated, LayoutRectangle, MeasureInWindowOnSuccessCallback } from "react-native";

import { Motion } from "../lib/SpotlightTour.context";

interface RefNode {
  measure: (callback: MeasureInWindowOnSuccessCallback) => void;
}

export interface ShapeProps {
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
  opacity: MutableRefObject<Animated.Value>;
  origin: MutableRefObject<Animated.ValueXY>;
  useNativeDriver: boolean;
}

interface ValueTransitionOptions extends BaseTransitionOptions {
  nextSize: number;
  size: MutableRefObject<Animated.Value>;
}

interface PointTransitionOptions extends BaseTransitionOptions {
  nextSize: Point;
  size: MutableRefObject<Animated.ValueXY>;
}

type TransitionOptions = ValueTransitionOptions | PointTransitionOptions;

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
      opacity.current.setValue(1);

      return Animated.parallel([
        Animated.spring(origin.current, {
          damping: 45,
          mass: 4,
          stiffness: 350,
          toValue: nextOrigin,
          useNativeDriver,
        }),
        Animated.spring(size.current, {
          damping: 35,
          mass: 4,
          stiffness: 350,
          toValue: nextSize,
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
          Animated.timing(origin.current, {
            duration: 0,
            toValue: nextOrigin,
            useNativeDriver,
          }),
          Animated.timing(size.current, {
            duration: 0,
            toValue: nextSize,
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
        Animated.timing(origin.current, {
          duration: 400,
          toValue: nextOrigin,
          useNativeDriver,
        }),
        Animated.timing(size.current, {
          duration: 400,
          toValue: nextSize,
          useNativeDriver,
        }),
      ]);
  }
}
