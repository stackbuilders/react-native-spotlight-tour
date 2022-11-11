import React, {
  ComponentClass,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  ColorValue,
  LayoutChangeEvent,
  LayoutRectangle,
  Modal,
  Platform,
  ViewStyle,
} from "react-native";
import { Circle, CircleProps, Defs, Mask, Rect, Svg } from "react-native-svg";

import { vhDP, vwDP } from "../../helpers/responsive";
import { Align, Position, SpotlightTourContext, TourStep } from "../SpotlightTour.context";
import { OSConfig } from "../SpotlightTour.provider";

import { OverlayView } from "./TourOverlay.styles";

export interface TourOverlayRef {
  hideTooltip(): Promise<Animated.EndResult>;
}

interface TourOverlayProps {
  color: ColorValue;
  current: number | undefined;
  opacity: number;
  spot: LayoutRectangle;
  tourStep: TourStep;
  nativeDriver: boolean | OSConfig<boolean>;
}

const AnimatedCircle = Animated.createAnimatedComponent<ComponentClass<CircleProps>>(Circle);

export const TourOverlay = forwardRef<TourOverlayRef, TourOverlayProps>((props, ref) => {
  const {
    color,
    current,
    opacity,
    spot,
    tourStep,
    nativeDriver,
  } = props;

  const { next, previous, steps, stop } = useContext(SpotlightTourContext);

  const [toolipStyle, setTooltipStyle] = useState<ViewStyle>({ });

  const radius = useRef(new Animated.Value(0)).current;
  const center = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const tipOpacity = useRef(new Animated.Value(0)).current;

  const r = useMemo((): number => {
    return (Math.max(spot.width, spot.height) / 2) * 1.15;
  }, [spot.width, spot.height]);

  const cx = useMemo((): number => {
    return spot.x + (spot.width / 2);
  }, [spot.x, spot.width]);

  const cy = useMemo((): number => {
    return spot.y + (spot.height / 2);
  }, [spot.y, spot.height]);

  const useNativeDriver = useMemo(() => {
    const driverConfig: OSConfig<boolean> = typeof nativeDriver === "boolean"
      ? { android: nativeDriver, ios: nativeDriver }
      : nativeDriver;

    return Platform.select({
      android: driverConfig.android,
      default: false,
      ios: driverConfig.ios,
    });
  }, [nativeDriver]);

  const computeTooltipStyles = useCallback((tipLayout: LayoutRectangle): ViewStyle => {
    const tipMargin: string = "2%";
    const align = tourStep.alignTo ?? Align.SPOT;

    switch (tourStep.position) {
      case Position.BOTTOM: return {
        left: align === Align.SPOT
          ? Math.round(cx - (tipLayout.width / 2))
          : Math.round((vwDP(100) - tipLayout.width) / 2),
        marginTop: tipMargin,
        top: Math.round(cy + r),
      };

      case Position.TOP: return {
        left: align === Align.SPOT
          ? Math.round(cx - (tipLayout.width / 2))
          : Math.round((vwDP(100) - tipLayout.width) / 2),
        marginBottom: tipMargin,
        top: Math.round(cy - r - tipLayout.height),
      };

      case Position.LEFT: return {
        left: Math.round(cx - r - tipLayout.width),
        marginRight: tipMargin,
        top: Math.round(cy - (tipLayout.height / 2)),
      };

      case Position.RIGHT: return {
        left: Math.round(cx + r),
        marginLeft: tipMargin,
        top: Math.round(cy - (tipLayout.height / 2)),
      };
    }
  }, [r, cx, cy, tourStep.position, tourStep.alignTo]);

  const measureTooltip = useCallback((event: LayoutChangeEvent): void => {
    const computedStyles = computeTooltipStyles(event.nativeEvent.layout);

    setTooltipStyle(computedStyles);
  }, [computeTooltipStyles]);

  useEffect(() => {
    const moveSpot = Animated.parallel([
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
      Animated.timing(tipOpacity, {
        delay: 500,
        duration: 300,
        toValue: 1,
        useNativeDriver,
      }),
    ]);

    moveSpot.start(() => setTooltipStyle({ }));
  }, [spot]);

  useImperativeHandle(ref, () => ({
    hideTooltip() {
      return new Promise(resolve => {
        if (current !== undefined) {
          Animated.timing(tipOpacity, {
            duration: 300,
            toValue: 0,
            useNativeDriver,
          })
          .start(resolve);
        } else {
          resolve({ finished: true });
        }
      });
    },
  }), [current !== undefined]);

  return (
    <Modal
      animationType="fade"
      presentationStyle="overFullScreen"
      transparent={true}
      visible={current !== undefined}
    >
      <OverlayView testID="Overlay View">
        <Svg
          testID="Spot Svg"
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

        <Animated.View
          testID="Tooltip View"
          onLayout={measureTooltip}
          style={{ ...toolipStyle, position: "absolute", opacity: tipOpacity }}
        >
          {current !== undefined && (
            <tourStep.render
              current={current}
              isFirst={current === 0}
              isLast={current === steps.length - 1}
              next={next}
              previous={previous}
              stop={stop}
            />
          )}
        </Animated.View>
      </OverlayView>
    </Modal>
  );
});
