import React, { useEffect, useImperativeHandle, useMemo, useState } from "react";
import {
  Animated,
  ColorValue,
  LayoutChangeEvent,
  LayoutRectangle,
  Modal,
  Platform,
  StyleProp,
  ViewStyle
} from "react-native";
import Svg, { Circle, Defs, Mask, Rect } from "react-native-svg";

import { vhDP, vwDP } from "../../helpers/responsive";
import { Align, Position, SpotlightTourCtx } from "../SpotlightTour.context";

import { OverlayView, TipView } from "./TourOverlay.styles";

export interface TourOverlayRef {
  hideTip(): Promise<void>;
}

interface TourOverlayProps {
  color?: ColorValue;
  opacity?: number | string;
  tour: SpotlightTourCtx;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const TourOverlay = React.forwardRef<TourOverlayRef, TourOverlayProps>((props, ref) => {
  const { color = "black", opacity = 0.45, tour } = props;
  const { current, next, previous, spot, steps, stop } = tour;

  if (!spot || current === undefined) {
    return null;
  }

  const [tourStep, setTourStep] = useState(steps[current]);
  const [tipStyle, setTipStyle] = useState<StyleProp<ViewStyle>>();
  const [radius] = useState(new Animated.Value(0));
  const [center] = useState(new Animated.ValueXY({ x: 0, y: 0 }));
  const [tipOpacity] = useState(new Animated.Value(0));

  const r = (Math.max(spot.width, spot.height) / 2) * 1.15;
  const cx = spot.x + (spot.width / 2);
  const cy = spot.y + (spot.height / 2);

  const useNativeDriver = useMemo(() => Platform.select({
    android: false,
    default: false,
    ios: false
  }), [Platform.OS]);

  const getTipStyles = (tipLayout: LayoutRectangle): StyleProp<ViewStyle> => {
    const tipMargin: string = "2%";
    const align = tourStep?.alignTo ?? Align.SPOT;

    switch (tourStep?.position) {
      case Position.BOTTOM: return {
        left: align === Align.SPOT
          ? Math.round(cx - (tipLayout.width / 2))
          : Math.round((vwDP(100) - tipLayout.width) / 2),
        marginTop: tipMargin,
        top: Math.round(cy + r)
      };

      case Position.TOP: return {
        left: align === Align.SPOT
          ? Math.round(cx - (tipLayout.width / 2))
          : Math.round((vwDP(100) - tipLayout.width) / 2),
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

    return tipStyle;
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
        useNativeDriver
      }),
      Animated.spring(radius, {
        damping: 30,
        mass: 5,
        stiffness: 300,
        toValue: r,
        useNativeDriver
      }),
      Animated.timing(tipOpacity, {
        delay: 500,
        duration: 500,
        toValue: 1,
        useNativeDriver
      })
    ]);

    moveIn.stop();
    setTourStep(steps[current]);

    /**
     * We need to start the animation asynchronously or the layout callback may
     * overlap, causing different behaviors in iOS and than Android.
     * TODO: Refactor the animation flow to better handle the layout callback.
     */
    setTimeout(() => {
      setTipStyle(undefined);
      moveIn.start();
    });
  }, [spot, current]);

  useImperativeHandle(ref, () => ({
    hideTip() {
      return new Promise<void>((resolve, reject) => {
        Animated.timing(tipOpacity, {
          duration: 200,
          toValue: 0,
          useNativeDriver
        })
        .start(({ finished }) => finished
          ? resolve()
          : reject()
        );
      });
    }
  }));

  return (
    <Modal
      animationType="fade"
      presentationStyle="overFullScreen"
      transparent={true}
      visible={true}
    >
      <OverlayView accessibilityLabel="Tour Overlay View">
        <Svg
          accessibilityLabel="Svg overlay view"
          height="100%"
          width="100%"
          viewBox={`0 0 ${vwDP(100)} ${vhDP(100)}`}
        >
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

        <TipView
          accessibilityLabel="Tip Overlay View"
          onLayout={measureTip}
          style={[tipStyle, { opacity: tipOpacity }]}
        >
          {tourStep?.render({
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
});
