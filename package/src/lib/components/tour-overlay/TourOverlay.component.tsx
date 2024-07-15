import {
  UseFloatingOptions,
  arrow,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react-native";
import React, {
  ComponentType,
  RefObject,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import {
  Animated,
  ColorValue,
  LayoutRectangle,
  Modal,
  Platform,
  View,
} from "react-native";
import { Defs, Mask, Rect, Svg } from "react-native-svg";

import { Optional, ToOptional } from "../../../helpers/common";
import { vhDP, vwDP } from "../../../helpers/responsive";
import { ShapeProps } from "../../../helpers/shape";
import {
  BackdropPressBehavior,
  Motion,
  OSConfig,
  Shape,
  SpotlightTourContext,
  TooltipProps,
  TourStep,
} from "../../SpotlightTour.context";

import { DEFAULT_ARROW, OverlayView, TooltipArrow } from "./TourOverlay.styles";
import { CircleShape } from "./shapes/CircleShape.component";
import { RectShape } from "./shapes/RectShape.component";

export interface TourOverlayRef {
  hideTooltip: () => Promise<Animated.EndResult>;
}

interface TourOverlayProps extends ToOptional<TooltipProps> {
  backdropOpacity: number;
  color: ColorValue;
  current: Optional<number>;
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
    motion,
    nativeDriver,
    onBackdropPress,
    padding,
    shape,
    spot,
    tourStep,
    ...tooltipProps
  } = props;

  const { goTo, next, previous, start, steps, stop } = useContext(SpotlightTourContext);

  const arrowRef = useRef<View>(null);

  const floating = useMemo((): TooltipProps => ({
    arrow: tourStep.arrow ?? tooltipProps.arrow,
    flip: tourStep.flip ?? tooltipProps.flip,
    offset: tourStep.offset ?? tooltipProps.offset,
    placement: tourStep.placement ?? tooltipProps.placement,
    shift: tourStep.shift ?? tooltipProps.shift,
  }), [tooltipProps, tourStep.arrow, tourStep.flip, tourStep.offset, tourStep.placement, tourStep.shift]);

  const floatingOptions = useMemo(() => {
    return makeFloatingOptions(arrowRef, floating);
  }, [floating]);

  const { refs, floatingStyles, middlewareData, placement } = useFloating(floatingOptions);

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
            <tourStep.render
              current={current}
              isFirst={current === 0}
              isLast={current === steps.length - 1}
              next={next}
              previous={previous}
              stop={stop}
              goTo={goTo}
            />
            {floating.arrow !== false && (
              <TooltipArrow
                ref={arrowRef}
                placement={placement}
                data={middlewareData.arrow}
                arrow={floating.arrow === true ? undefined : floating.arrow}
              />
            )}
          </Animated.View>
        )}
      </OverlayView>
    </Modal>
  );
});

function makeFloatingOptions(arrowRef: RefObject<View>, props: Optional<TooltipProps>): UseFloatingOptions {
  const arrowOption = typeof props?.arrow === "boolean"
    ? DEFAULT_ARROW
    : props?.arrow;
  const { size } = typeof arrowOption === "number"
    ? { ...DEFAULT_ARROW, size: arrowOption }
    : { ...DEFAULT_ARROW, ...arrowOption };
  const baseOffset = props?.offset || 4;
  const offsetValue = props?.arrow !== false
    ? (Math.sqrt(2 * size ** 2) / 2) + baseOffset
    : baseOffset;
  const arrowMw = props?.arrow !== false
    ? arrow({ element: arrowRef })
    : undefined;
  const flipMw = props?.flip !== false
    ? flip(props?.flip === true ? undefined : props?.flip)
    : undefined;
  const offsetMw = props?.offset !== 0
    ? offset(offsetValue)
    : undefined;
  const shiftMw = props?.shift !== false
    ? shift(typeof props?.shift === "object" ? props.shift : { padding: 8 })
    : undefined;

  return {
    middleware: [flipMw, offsetMw, shiftMw, arrowMw].filter(Boolean),
    placement: props?.placement,
  };
}
