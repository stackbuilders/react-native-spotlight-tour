import { memo, useEffect, useMemo, useRef } from "react";
import isEqual from "react-fast-compare";
import { Animated } from "react-native";
import { Rect } from "react-native-svg";

import { type ShapeProps, transitionOf } from "../../../../helpers/shape";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export const RectShape = memo<ShapeProps>(props => {
  const { borderRadius, motion, padding, setReference, spot, useNativeDriver } = props;

  const width = useMemo((): number => {
    return spot.width + padding;
  }, [spot.width, padding]);

  const height = useMemo((): number => {
    return spot.height + padding;
  }, [spot.height, padding]);

  const x = useMemo((): number => {
    return spot.x - ((width - spot.width) / 2);
  }, [spot.x, spot.width, width]);

  const y = useMemo((): number => {
    return spot.y - ((height - spot.height) / 2);
  }, [spot.y, spot.height, height]);

  const size = useRef(new Animated.ValueXY({ x: width, y: height }, { useNativeDriver })).current;
  const origin = useRef(new Animated.ValueXY({ x, y }, { useNativeDriver })).current;
  const opacity = useRef(new Animated.Value(0, { useNativeDriver })).current;

  useEffect(() => {
    const transition = transitionOf({
      motion,
      nextOrigin: { x, y },
      nextSize: { x: width, y: height },
      opacity,
      origin,
      size,
      useNativeDriver,
    });

    transition.start();

    setReference({
      measure: callback => {
        callback(x, y, width, height);
      },
    });

    return () => setReference(undefined);
  }, [x, y, width, height, setReference, motion, useNativeDriver]);

  return (
    <AnimatedRect
      x={origin.x}
      y={origin.y}
      width={size.x}
      height={size.y}
      opacity={opacity}
      fill="black"
      rx={borderRadius}
      ry={borderRadius}
    />
  );
}, isEqual);
