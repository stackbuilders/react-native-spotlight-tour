import {
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  Animated,
  ColorValue,
  Dimensions,
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
  OSConfig,
  Position,
  SpotlightTourContext,
  TourStep,
} from "../../SpotlightTour.context";

import { OverlayView, SPOT_PADDING } from "./TourOverlay.styles";
import { CircleShape } from "./shapes/CircleShape.component";

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
  const tooltipOpacity = useRef(new Animated.Value(0));

  const isFirstStep = useMemo((): boolean => {
    return current === 0;
  }, [current]);

  const isLastStep = useMemo((): boolean => {
    return current === steps.length - 1;
  }, [current, steps]);

  const useNativeDriver = useMemo(() => {
    const driverConfig: OSConfig<boolean> = typeof nativeDriver === "boolean"
      ? { android: nativeDriver, ios: nativeDriver, web: nativeDriver }
      : nativeDriver;

    return Platform.select({
      android: driverConfig.android,
      default: false,
      ios: driverConfig.ios,
      web: driverConfig.web,
    });
  }, [nativeDriver]);

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

  useEffect(() => {
    tooltipRef.current?.measureInWindow((_x, _y, width, height) => {
      setTooltipStyle(() => {
        const align = tourStep.alignTo ?? Align.SPOT;
        const half = (Math.max(spot.width, spot.height) / 2) * SPOT_PADDING;
        const cx = spot.x + (spot.width / 2);
        const cy = spot.y + (spot.height / 2);
        const window = Dimensions.get("window");
        const tooltipGap = 10;

        switch (tourStep.position) {
          case Position.BOTTOM: return {
            left: align === Align.SPOT
              ? cx - (width / 2)
              : (vwDP(100) - width) / 2,
            marginTop: tooltipGap,
            top: cy + half,
          };

          case Position.TOP: return {
            bottom: window.height - cy + half,
            left: align === Align.SPOT
              ? cx - (width / 2)
              : (vwDP(100) - width) / 2,
            marginBottom: tooltipGap,
          };

          case Position.LEFT: return {
            marginRight: tooltipGap,
            right: window.width - cx + half,
            top: cy - (height / 2),
          };

          case Position.RIGHT: return {
            left: cx + half,
            marginLeft: tooltipGap,
            top: cy - (height / 2),
          };
        }
      });
    });
  }, [spot.height, spot.width, spot.x, spot.y, tourStep.alignTo, tourStep.position]);

  useEffect(() => {
    const { height, width } = spot;

    if ([height, width].every(value => value > 0)) {
      Animated.timing(tooltipOpacity.current, {
        delay: 400,
        duration: 400,
        toValue: 1,
        useNativeDriver,
      })
      .start();
    }
  }, [spot, useNativeDriver]);

  useImperativeHandle<TourOverlayRef, TourOverlayRef>(ref, () => ({
    hideTooltip: () => {
      return new Promise(resolve => {
        if (current !== undefined) {
          Animated.timing(tooltipOpacity.current, {
            duration: 400,
            toValue: 0,
            useNativeDriver,
          })
          .start(resolve);
        } else {
          resolve({ finished: true });
        }
      });
    },
  }), [current, useNativeDriver]);

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
          shouldRasterizeIOS={true}
          renderToHardwareTextureAndroid={true}
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
          style={{ ...toolipStyle, opacity: tooltipOpacity.current, position: "absolute" }}
        >
          {current !== undefined && (
            <tourStep.render
              current={current}
              isFirst={isFirstStep}
              isLast={isLastStep}
              next={next}
              previous={previous}
              stop={stop}
              goTo={goTo}
            />
          )}
        </Animated.View>
      </OverlayView>
    </Modal>
  );
});
