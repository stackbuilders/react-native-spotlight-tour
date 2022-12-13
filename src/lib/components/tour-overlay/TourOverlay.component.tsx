import React, {
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import {
  Animated,
  ColorValue,
  LayoutRectangle,
  Modal,
  Platform,
  View,
  ViewStyle,
} from "react-native";
import { Defs, Mask, Rect, Svg } from "react-native-svg";

import { Optional } from "../../../helpers/common";
import { vhDP, vwDP } from "../../../helpers/responsive";
import {
  Align,
  BackdropPressBehavior,
  Motion,
  Position,
  SpotlightTourContext,
  TourStep,
} from "../../SpotlightTour.context";
import { OSConfig } from "../../SpotlightTour.provider";

import { CircleShape } from "./shapes/CircleShape.component";
import { OverlayView } from "./TourOverlay.styles";

export interface TourOverlayRef {
  hideTooltip: () => Promise<Animated.EndResult>;
}

interface TourOverlayProps {
  backdropOpacity: number;
  color: ColorValue;
  current: Optional<number>;
  motion: Motion;
  nativeDriver: boolean | OSConfig<boolean>;
  onBackdropPress: Optional<BackdropPressBehavior>;
  spot: LayoutRectangle;
  tourStep: TourStep;
}

export const TourOverlay = forwardRef<TourOverlayRef, TourOverlayProps>((props, ref) => {
  const {
    color,
    current,
    motion,
    nativeDriver,
    onBackdropPress,
    backdropOpacity,
    spot,
    tourStep,
  } = props;

  const { goTo, next, previous, start, steps, stop } = useContext(SpotlightTourContext);

  const [toolipStyle, setTooltipStyle] = useState<ViewStyle>({ });

  const tooltipRef = useRef<View>(null);
  const tooltipOpacity = useRef(new Animated.Value(0)).current;

  const isFirstStep = useMemo((): boolean => {
    return current === 0;
  }, [current]);

  const isLastStep = useMemo((): boolean => {
    return current === steps.length - 1;
  }, [current, steps]);

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

  const computeTooltipStyles = useCallback((layout: LayoutRectangle): ViewStyle => {
    const tipMargin = "2%";
    const align = tourStep.alignTo ?? Align.SPOT;
    const r = (Math.max(spot.width, spot.height) / 2) * 1.15;
    const cx = spot.x + (spot.width / 2);
    const cy = spot.y + (spot.height / 2);

    switch (tourStep.position) {
      case Position.BOTTOM: return {
        left: align === Align.SPOT
          ? Math.round(cx - (layout.width / 2))
          : Math.round((vwDP(100) - layout.width) / 2),
        marginTop: tipMargin,
        top: Math.round(cy + r),
      };

      case Position.TOP: return {
        left: align === Align.SPOT
          ? Math.round(cx - (layout.width / 2))
          : Math.round((vwDP(100) - layout.width) / 2),
        marginBottom: tipMargin,
        top: Math.round(cy - r - layout.height),
      };

      case Position.LEFT: return {
        left: Math.round(cx - r - layout.width),
        marginRight: tipMargin,
        top: Math.round(cy - (layout.height / 2)),
      };

      case Position.RIGHT: return {
        left: Math.round(cx + r),
        marginLeft: tipMargin,
        top: Math.round(cy - (layout.height / 2)),
      };
    }
  }, [spot, tourStep.position, tourStep.alignTo]);

  const handleBackdropPress = useCallback((): void => {
    const handler = tourStep.onBackdropPress ?? onBackdropPress;

    if (handler !== undefined && current !== undefined) {
      switch (handler) {
        case "continue":
          return next();

        case "stop":
          return stop();

        default:
          return handler({ current, goTo, next, previous, start, stop });
      }
    }
  }, [tourStep, onBackdropPress, current, goTo, next, previous, start, stop]);

  useLayoutEffect(() => {
    tooltipRef.current?.measureInWindow((x, y, width, height) => {
      const computedStyles = computeTooltipStyles({ height, width, x, y });
      setTooltipStyle(computedStyles);
    });
  }, [computeTooltipStyles]);

  useLayoutEffect(() => {
    const { height, width, x, y } = spot;

    if ([height, width, x, y].every(value => value > 0)) {
      Animated.timing(tooltipOpacity, {
        delay: 500,
        duration: 300,
        toValue: 1,
        useNativeDriver,
      })
      .start();
    }
  }, [spot]);

  useImperativeHandle<TourOverlayRef, TourOverlayRef>(ref, () => ({
    hideTooltip: () => {
      return new Promise(resolve => {
        if (current !== undefined) {
          Animated.timing(tooltipOpacity, {
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
  }), [current]);

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
          onPress={handleBackdropPress}
        >
          <Defs>
            <Mask id="mask" x={0} y={0} height="100%" width="100%">
              <Rect height="100%" width="100%" fill="#fff" />
              <CircleShape
                motion={tourStep.motion ?? motion}
                useNativeDriver={useNativeDriver}
              />
            </Mask>
          </Defs>

          <Rect
            height="100%"
            width="100%"
            fill={color}
            mask="url(#mask)"
            opacity={backdropOpacity}
          />
        </Svg>

        <Animated.View
          ref={tooltipRef}
          testID="Tooltip View"
          style={{ ...toolipStyle, opacity: tooltipOpacity, position: "absolute" }}
        >
          {current !== undefined && (
            <tourStep.render
              current={current}
              isFirst={isFirstStep}
              isLast={isLastStep}
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
