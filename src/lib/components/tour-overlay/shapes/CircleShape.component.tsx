import { memo, useContext, useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Circle } from "react-native-svg";

import { Motion, SpotlightTourContext } from "../../../SpotlightTour.context";

interface CircleShapeProps {
  motion: Motion;
  useNativeDriver: boolean;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const CircleShape = memo<CircleShapeProps>(({ motion, useNativeDriver }) => {
  const { spot } = useContext(SpotlightTourContext);

  const center = useRef(new Animated.ValueXY({ x: 0, y: 0 }, { useNativeDriver }));
  const opacity = useRef(new Animated.Value(0, { useNativeDriver }));
  const radius = useRef(new Animated.Value(0, { useNativeDriver }));

  useEffect(() => {
    const { height, width, x, y } = spot;
    const r = (Math.max(width, height) / 2) * 1.15;
    const cx = x + (width / 2);
    const cy = y + (height / 2);

    const transition = (): Animated.CompositeAnimation => {
      switch (motion) {
        case Motion.BOUNCE:
          opacity.current.setValue(1);

          return Animated.parallel([
            Animated.spring(center.current, {
              damping: 50,
              mass: 5,
              stiffness: 400,
              toValue: { x: cx, y: cy },
              useNativeDriver,
            }),
            Animated.spring(radius.current, {
              damping: 30,
              mass: 5,
              stiffness: 400,
              toValue: r,
              useNativeDriver,
            }),
          ]);

        case Motion.FADE:
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

        case Motion.SLIDE:
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
  }, [motion, spot, useNativeDriver]);

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
}, (prev, next) => prev.motion === next.motion);
