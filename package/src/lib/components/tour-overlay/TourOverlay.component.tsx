import {
  type FlipOptions,
  type Middleware,
  type ShiftOptions,
  type UseFloatingOptions,
  arrow,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react-native";
import {
  type ComponentType,
  type RefObject,
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
  type ColorValue,
  Dimensions,
  type LayoutRectangle,
  Modal,
  Platform,
  StatusBar,
  View,
} from "react-native";
import { Defs, Mask, Rect, Svg } from "react-native-svg";

import { vh, vw } from "../../../helpers/responsive";
import {
  type BackdropPressBehavior,
  type Motion,
  type OSConfig,
  type Shape,
  type ShapeOptions,
  SpotlightTourContext,
  type TooltipProps,
  type TourStep,
} from "../../SpotlightTour.context";

import { Css, DEFAULT_ARROW, arrowCss } from "./TourOverlay.styles";
import { CircleShape } from "./shapes/CircleShape.component";
import { RectShape } from "./shapes/RectShape.component";

import type { Optional, ToOptional } from "../../../helpers/common";
import type { ShapeProps } from "../../../helpers/shape";

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
  shape: Shape | ShapeOptions;
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
    shape,
    spot,
    tourStep,
    ...tooltipProps
  } = props;

  const { goTo, next, pause, previous, resume, start, steps, stop } = useContext(SpotlightTourContext);

  const arrowRef = useRef<View>(null);

  // Get actual screen dimensions for edge-to-edge support
  const screenDimensions = useMemo(() => {
    const { width, height } = Dimensions.get('screen');
    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
    
    // For Android edge-to-edge, use full screen dimensions
    return {
      width,
      height: Platform.OS === 'android' ? height : height,
      viewBoxWidth: width,
      viewBoxHeight: Platform.OS === 'android' ? height : height,
      statusBarHeight,
    };
  }, []);

  // Adjust spot position for status bar offset when using statusBarTranslucent
  const adjustedSpot = useMemo(() => {
    if (Platform.OS === 'android' && screenDimensions.statusBarHeight > 0) {
      return {
        ...spot,
        y: spot.y + screenDimensions.statusBarHeight,
      };
    }
    return spot;
  }, [spot, screenDimensions.statusBarHeight]);

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

  const { floatingStyles, middlewareData, placement, refs } = useFloating(floatingOptions);

  const tooltipOpacity = useRef(new Animated.Value(0));

  const stepMotion = useMemo((): Motion => {
    return tourStep.motion ?? motion;
  }, [tourStep, motion]);

  const shapeOptions = useMemo((): Required<ShapeOptions> => {
    const options = tourStep.shape ?? shape;
    const padding = 16;

    return typeof options !== "string"
      ? { padding, type: "circle", ...options }
      : { padding, type: options };
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
    switch (shapeOptions.type) {
      case "circle": return CircleShape;
      case "rectangle": return RectShape;
    }
  }, [shapeOptions]);

  const handleBackdropPress = useCallback((): void => {
    const handler = tourStep.onBackdropPress ?? onBackdropPress;

    if (handler !== undefined && current !== undefined) {
      switch (handler) {
        case "continue":
          return next();

        case "stop":
          return stop();

        default:
          return handler({ current, goTo, next, pause, previous, resume, start, status: "running", stop });
      }
    }
  }, [tourStep, onBackdropPress, current, goTo, next, previous, start, stop, pause, resume]);

  useEffect(() => {
    const { height, width } = adjustedSpot;

    if ([height, width].every(value => value > 0)) {
      Animated.timing(tooltipOpacity.current, {
        delay: 400,
        duration: 400,
        toValue: 1,
        useNativeDriver,
      })
        .start();
    }
  }, [adjustedSpot, useNativeDriver]);

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
      supportedOrientations={["portrait", "landscape", "landscape-left", "landscape-right", "portrait-upside-down"]}
      transparent={true}
      visible={current !== undefined}
      statusBarTranslucent
    >
      <View 
        testID="Overlay View" 
        style={[
          Css.overlayView,
          {
            height: screenDimensions.height,
            width: screenDimensions.width,
          }
        ]}
      >        <Svg
          testID="Spot Svg"
          height={screenDimensions.height}
          width={screenDimensions.width}
          viewBox={`0 0 ${screenDimensions.viewBoxWidth} ${screenDimensions.viewBoxHeight}`}
          onPress={handleBackdropPress}
          shouldRasterizeIOS={true}
          renderToHardwareTextureAndroid={true}
        >
          <Defs>
            <Mask id="mask" x={0} y={0} height="100%" width="100%">
              <Rect height={screenDimensions.height} width={screenDimensions.width} fill="#fff" />
              <ShapeMask
                spot={adjustedSpot}
                setReference={refs.setReference}
                motion={stepMotion}
                padding={shapeOptions.padding}
                useNativeDriver={useNativeDriver}
              />
            </Mask>
          </Defs>
          <Rect
            height={screenDimensions.height}
            width={screenDimensions.width}
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
              pause={pause}
              resume={resume}
              goTo={goTo}
            />
            {floating.arrow !== false && (
              <View
                style={[
                  Css.tooltipArrow,
                  arrowCss({
                    arrow: typeof floating.arrow !== "boolean"
                      ? floating.arrow
                      : undefined,
                    data: middlewareData.arrow,
                    placement,
                  }),
                ]}
                ref={arrowRef}
              />
            )}
          </Animated.View>
        )}
      </View>
    </Modal>
  );
});

function makeFloatingOptions(arrowRef: RefObject<null | View>, props: Optional<TooltipProps>): UseFloatingOptions {
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
  const flipMw = flipMiddleware(props?.flip);
  const offsetMw = props?.offset !== 0
    ? offset(offsetValue)
    : undefined;
  const shiftMw = shiftMiddleware(props?.shift);

  return {
    middleware: [flipMw, offsetMw, shiftMw, arrowMw].filter(Boolean),
    placement: props?.placement,
  };
}

function flipMiddleware(flipProps: Optional<boolean | FlipOptions>): Optional<Middleware> {
  if (flipProps !== false) {
    return flip(flipProps === true ? undefined : flipProps);
  }

  return undefined;
}

function shiftMiddleware(shiftProps: Optional<boolean | ShiftOptions>): Optional<Middleware> {
  if (shiftProps !== false) {
    return shift(shiftProps === true ? undefined : shiftProps);
  }

  return undefined;
}
