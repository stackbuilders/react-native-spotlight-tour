import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  InteractionManager,
  LayoutChangeEvent,
  LayoutRectangle,
  Modal,
  StyleProp,
  ViewStyle
} from "react-native";
import Svg, { Circle, Defs, Mask, Rect, rgbaArray } from "react-native-svg";

import { vhDP, vwDP } from "../../helpers/responsive";
import { Align, Position, Tour } from "../SpotlightTour.context";

import { OverlayView, TipView } from "./TourOverlay.styles";

interface TourOverlayProps {
  color?: string | number | rgbaArray;
  opacity?: number | string;
  tour: Tour;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const TourOverlay: React.FC<TourOverlayProps> = ({ color = "black", opacity = 0.45, tour }) => {
  const { current, next, previous, spot, steps, stop } = tour;

  if (!spot || current === undefined) {
    return null;
  }

  const [tourStep, setTourStep] = useState(steps[current]);
  const [tipStyle, setTipStyle] = useState<Animated.WithAnimatedValue<StyleProp<ViewStyle>>>();

  const r = (Math.max(spot.width, spot.height) / 2) * 1.15;
  const cx = spot.x + (spot.width / 2);
  const cy = spot.y + (spot.height / 2);

  const radius = useRef(new Animated.Value(0)).current;
  const center = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const tipOpacity = useRef(new Animated.Value(0)).current;

  const getTipStyles = (tipLayout: LayoutRectangle): Animated.WithAnimatedValue<StyleProp<ViewStyle>> => {
    const tipMargin: string = "2%";
    const align = tourStep.alignTo ?? Align.SPOT;

    switch (tourStep.position) {
      case Position.BOTTOM: return {
        left: align === Align.SPOT
          ? Math.round(cx - (tipLayout.width / 2))
          : Math.round((vwDP(100) - tipLayout.width) / 2),
        marginTop: tipMargin,
        top: Math.round(cy + r)
      };

      case Position.TOP: return {
        left: Math.round(cx - (tipLayout.width / 2)),
        marginBottom: tipMargin,
        top: Math.round(cy - r - tipLayout.height)
      };

      case Position.LEFT: return {
        left: Math.round(cx - r - tipLayout.width),
        marginRight: tipMargin,
        top: Math.round(cy - (tipLayout.height / 2))
      };

      case Position.RIGHT: return {
        left: Math.round(cx + r),
        marginLeft: tipMargin,
        top: Math.round(cy - (tipLayout.height / 2))
      };
    }
  };

  const measureTip = (event: LayoutChangeEvent) => {
    setTipStyle(getTipStyles(event.nativeEvent.layout));
  };

  useEffect(() => {
    const moveIn = Animated.parallel([
      Animated.spring(center, {
        damping: 50,
        mass: 5,
        stiffness: 300,
        toValue: { x: cx, y: cy },
        useNativeDriver: true
      }),
      Animated.spring(radius, {
        damping: 30,
        mass: 5,
        stiffness: 300,
        toValue: r,
        useNativeDriver: true
      }),
      Animated.timing(tipOpacity, {
        delay: 500,
        duration: 500,
        toValue: 1,
        useNativeDriver: true
      })
    ]);
    const moveOut = Animated.timing(tipOpacity, {
      duration: 200,
      toValue: 0,
      useNativeDriver: true
    });

    moveOut.start(({ finished }) => {
      if (finished) {
        setTourStep(steps[current]);
        setTipStyle(undefined);

        InteractionManager.runAfterInteractions(moveIn.start);
      }
    });
  }, [spot, current]);

  return (
    <Modal
      animationType="fade"
      presentationStyle="overFullScreen"
      transparent={true}
      visible={true}
    >
      <OverlayView>
        <Svg height="100%" width="100%" viewBox={`0 0 ${vwDP(100)} ${vhDP(100)}`}>
          <Defs>
            <Mask id="mask" x={0} y={0} height="100%" width="100%">
              <Rect height="100%" width="100%" fill="#fff" />
              <AnimatedCircle
                r={radius}
                cx={center.x}
                cy={center.y}
                fill="black"
              />
            </Mask>
          </Defs>

          <Rect
            height="100%"
            width="100%"
            fill={color}
            mask="url(#mask)"
            opacity={opacity}
          />
        </Svg>

        <TipView style={[tipStyle, { opacity: tipOpacity }]} onLayout={measureTip}>
          {tourStep.render({
            current,
            isFirst: current === 0,
            isLast: current === steps.length - 1,
            next,
            previous,
            stop
          })}
        </TipView>
      </OverlayView>
    </Modal>
  );
};
