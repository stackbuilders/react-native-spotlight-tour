import React, { memo, useEffect, useMemo, useRef } from "react";
import isEqual from "react-fast-compare";
import { Animated } from "react-native";
import { Rect } from "react-native-svg";

import { ShapeProps } from "./shape.types";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export const RectShape = memo<ShapeProps>(props => {
  const { motion, padding, setReference, spot, useNativeDriver } = props;

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

  const size = useRef(new Animated.ValueXY({ x: width, y: height }, { useNativeDriver }));
  const origin = useRef(new Animated.ValueXY({ x, y }, { useNativeDriver }));
  const opacity = useRef(new Animated.Value(0, { useNativeDriver }));

  useEffect(() => {
    const transition = (): Animated.CompositeAnimation => {
      switch (motion) {
        case "bounce":
          opacity.current.setValue(1);

          return Animated.parallel([
            Animated.spring(origin.current, {
              damping: 45,
              mass: 4,
              stiffness: 350,
              toValue: { x, y },
              useNativeDriver,
            }),
            Animated.spring(size.current, {
              damping: 35,
              mass: 4,
              stiffness: 350,
              toValue: { x: width, y: height },
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
                toValue: { x, y },
                useNativeDriver,
              }),
              Animated.timing(size.current, {
                duration: 0,
                toValue: { x: width, y: height },
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
              toValue: { x, y },
              useNativeDriver,
            }),
            Animated.timing(size.current, {
              duration: 400,
              toValue: { x: width, y: height },
              useNativeDriver,
            }),
          ]);
      }
    };

    transition().start();

    setReference({
      measure: callback => {
        callback(x, y, width, height);
      },
    });

    return () => setReference(undefined);
  }, [x, y, width, height, setReference, motion, useNativeDriver]);

  return (
    <AnimatedRect
      x={origin.current.x}
      y={origin.current.y}
      width={size.current.x}
      height={size.current.y}
      opacity={opacity.current}
      fill="black"
      rx={4}
      ry={4}
    />
  );
}, isEqual);
