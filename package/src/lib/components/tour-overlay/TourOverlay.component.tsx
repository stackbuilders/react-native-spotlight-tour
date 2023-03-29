import { useFloating } from "@floating-ui/react-native";
import React, {
  ComponentType,
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
  FloatingProps,
  Motion,
  OSConfig,
  Shape,
  SpotlightTourContext,
  TourStep,
} from "../../SpotlightTour.context";

import { OverlayView } from "./TourOverlay.styles";
import { CircleShape } from "./shapes/CircleShape.component";
import { RectShape } from "./shapes/RectShape.component";
import { ShapeProps } from "./shapes/shape.types";

export interface TourOverlayRef {
  hideTooltip: () => Promise<Animated.EndResult>;
}

interface TourOverlayProps {
  backdropOpacity: number;
  color: ColorValue;
  current: Optional<number>;
  floatingProps: FloatingProps;
  motion: Motion;
  nativeDriver: boolean | OSConfig<boolean>;
  onBackdropPress: Optional<BackdropPressBehavior>;
  padding: number;
  shape: Shape;
  spot: LayoutRectangle;
  tourStep: TourStep;
}

export const TourOverlay = forwardRef<TourOverlayRef, TourOverlayProps>((props, ref) => {
  const {
    backdropOpacity,
    color,
    current,
    floatingProps,
    motion,
    nativeDriver,
    onBackdropPress,
    padding,
    shape,
    spot,
    tourStep,
  } = props;

  const { goTo, next, previous, start, steps, stop } = useContext(SpotlightTourContext);
  const { refs, floatingStyles } = useFloating(tourStep.floatingProps ?? floatingProps);

  const tooltipOpacity = useRef(new Animated.Value(0));

  const stepMotion = useMemo((): Motion => {
    return tourStep.motion ?? motion;
  }, [tourStep, motion]);

  const stepShape = useMemo((): Shape => {
    return tourStep.shape ?? shape;
  }, [tourStep, shape]);

  const useNativeDriver = useMemo(() => {
    const driverConfig: OSConfig<boolean> = typeof nativeDriver === "boolean"
      ? { android: nativeDriver, ios: nativeDriver, web: nativeDriver }
      : nativeDriver;

    return Platform.select({
      android: driverConfig.android,
      default: false,
      ios: driverConfig.ios,
      web: false,
    });
  }, [nativeDriver]);

  const ShapeMask = useMemo(<P extends ShapeProps>(): ComponentType<P> => {
    switch (stepShape) {
      case "circle": return CircleShape;
      case "rectangle": return RectShape;
    }
  }, [stepShape]);

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
              <ShapeMask
                spot={spot}
                setReference={refs.setReference}
                motion={stepMotion}
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

        {current !== undefined && (
          <Animated.View
            ref={refs.setFloating}
            testID="Tooltip View"
            style={{ ...floatingStyles, opacity: tooltipOpacity.current }}
          >
            <>
              <tourStep.render
                current={current}
                isFirst={current === 0}
                isLast={current === steps.length - 1}
                next={next}
                previous={previous}
                stop={stop}
                goTo={goTo}
              />
            </>
          </Animated.View>
        )}
      </OverlayView>
    </Modal>
  );
});
