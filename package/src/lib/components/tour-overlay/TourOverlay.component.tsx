import React, {
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useEffect,
} from "react";
import {
  Animated,
  ColorValue,
  LayoutRectangle,
  Modal,
  Platform,
} from "react-native";
import { Defs, Mask, Rect, Svg } from "react-native-svg";

import { Optional } from "../../../helpers/common";
import { vhDP, vwDP } from "../../../helpers/responsive";
import {
  BackdropPressBehavior,
  Motion,
  OSConfig,
  SpotlightTourContext,
  TourStep,
} from "../../SpotlightTour.context";

import { OverlayView } from "./TourOverlay.styles";
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
  padding: number;
  spot: LayoutRectangle;
  tourStep: TourStep;
}

export const TourOverlay = forwardRef<TourOverlayRef, TourOverlayProps>((props, ref) => {
  const {
    backdropOpacity,
    color,
    current,
    motion,
    nativeDriver,
    onBackdropPress,
    padding,
    spot,
    tourStep,
  } = props;

  const { goTo, next, previous, start, stop } = useContext(SpotlightTourContext);

  const tooltipOpacity = useRef(new Animated.Value(0));

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
                tourStep={tourStep}
                motion={tourStep.motion ?? motion}
                padding={padding}
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
      </OverlayView>
    </Modal>
  );
});
