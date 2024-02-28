import { flip, offset, shift } from "@floating-ui/react-native";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { ColorValue, LayoutRectangle } from "react-native";

import { ChildFn, isChildFunction } from "../helpers/common";

import {
  BackdropPressBehavior,
  Motion,
  OSConfig,
  StopParams,
  Shape,
  SpotlightTour,
  SpotlightTourContext,
  SpotlightTourCtx,
  TourStep,
  ZERO_SPOT,
  FloatingProps,
} from "./SpotlightTour.context";
import { TourOverlay, TourOverlayRef } from "./components/tour-overlay/TourOverlay.component";

export interface SpotlightTourProviderProps {
  /**
   * The children to render in the provider. It accepts either a React
   * component, or a function that returns a React component. When the child is
   * a function, the `SpotlightTour` context can be accessed from the first
   * argument.
   */
  children: React.ReactNode | ChildFn<SpotlightTour>;
  /**
   * Specifies {@link FloatingProps} in order to configure Floating UI
   * in all tour steps layout.
   *
   * @default middlewares: [flip(), offset(4), shift()]
   * @default placement: "bottom"
   */
  floatingProps?: FloatingProps;
  /**
   * Sets the default transition motion for all steps. You can override this
   * value on each step too.
   *
   * @default bounce
   */
  motion?: Motion;
  /**
   * Define if the animations in the tour should use the native driver or not.
   * A boolean can be used to apply the same value to both Android and iOS, or
   * an object with `android` and `ios` keys can be used to define a value for
   * each OS.
   *
   * @default false
   */
  nativeDriver?: boolean | OSConfig<boolean>;
  /**
   * Sets the default behavior of pressing the tour's backdrop. You can use
   * either one of the following values:
   * - A callback function with the {@link SpotlightTour} options object in the
   * first argument. This allows more granular control over the tour.
   * - The `continue` literal string, which is a shortcut to move to the next
   * step, and stop the tour on the last step.
   * - the `stop` literal string, which is a shortcut to stop the tour.
   *
   * **NOTE:** You can also override this behavior on each step configuration.
   */
  onBackdropPress?: BackdropPressBehavior;
  /**
   * Handler which gets executed when {@link SpotlightTour.stop|stop} is
   * invoked. It receives the {@link StopParams} so
   * you can access the `current` step index where the tour stopped
   * and a bool value `isLast` indicating if the step where the tour stopped is
   * the last one.
   */
  onStop?: (values: StopParams) => void;
  /**
   * The color of the overlay of the tour.
   *
   * @default black
   */
  overlayColor?: ColorValue;
  /**
   * The opacity applied to the overlay of the tour (between 0 to 1).
   *
   * @default 0.45
   */
  overlayOpacity?: number;
  /**
   * Sets the default spotlight shape for all steps. You can override this
   * value on each step too.
   *
   * @default circle
   */
  shape?: Shape;
  /**
   * Defines the padding of the spot shape based on the wrapped component, so a
   * zero padding means the spot shape will fit exactly around the wrapped
   * component. The padding value is a number in points.
   *
   * @default 16;
   */
  spotPadding?: number;
  /**
   * An array of `TourStep` objects that define each step of the tour.
   */
  steps: TourStep[];
}

/**
 * React provider component to get access to the SpotlightTour context.
 */
export const SpotlightTourProvider = forwardRef<SpotlightTour, SpotlightTourProviderProps>((props, ref) => {
  const {
    children,
    floatingProps = {
      middleware: [flip(), offset(4), shift()],
      placement: "bottom",
    },
    motion = "bounce",
    nativeDriver = true,
    onBackdropPress,
    onStop,
    overlayColor = "black",
    overlayOpacity = 0.45,
    shape = "circle",
    spotPadding = 16,
    steps,
  } = props;

  const [current, setCurrent] = useState<number>();
  const [spot, setSpot] = useState(ZERO_SPOT);
  const [nextSpot, setNextSpot] = useState(ZERO_SPOT);

  const overlay = useRef<TourOverlayRef>({
    hideTooltip: () => Promise.resolve({ finished: false }),
  });

  const renderStep = useCallback((index: number): void | Promise<void> => {
    const step = steps[index];

    if (step !== undefined) {
      return Promise.all([
        overlay.current.hideTooltip(),
        Promise.resolve().then(() => step.before?.(nextSpot)),
      ]).then(() => setCurrent(index));
    }
  }, [steps]);

  const changeSpot = useCallback((newSpot: LayoutRectangle): void => {
    setSpot(newSpot);
  }, []);

  const changeNextSpot = useCallback((newSpot: LayoutRectangle): void => {
    setNextSpot(newSpot);
  }, []);

  const start = useCallback((): void => {
    renderStep(0);
  }, [renderStep]);

  const stop = useCallback((): void => {
    setCurrent(prev => {
      if (prev !== undefined) {
        onStop?.({ index: prev, isLast: prev === steps.length - 1 });
      }
      return undefined;
    });
    setSpot(ZERO_SPOT);
  }, [onStop]);

  const next = useCallback((): void => {
    if (current !== undefined) {
      current === steps.length - 1
        ? stop()
        : renderStep(current + 1);
    }
  }, [stop, renderStep, current, steps.length]);

  const previous = useCallback((): void => {
    if (current !== undefined && current > 0) {
      renderStep(current - 1);
    }
  }, [renderStep, current]);

  const goTo = useCallback((index: number): void => {
    renderStep(index);
  }, [renderStep]);

  const currentStep = useMemo((): TourStep => {
    const step = current !== undefined
      ? steps[current]
      : undefined;

    return step ?? { floatingProps, render: () => <></> };
  }, [steps, current]);

  const tour = useMemo((): SpotlightTourCtx => ({
    changeNextSpot,
    changeSpot,
    current,
    goTo,
    next,
    previous,
    spot,
    start,
    steps,
    stop,
  }), [changeNextSpot, changeSpot, current, goTo, next, previous, spot, start, steps, stop]);

  useImperativeHandle(ref, () => ({
    current,
    goTo,
    next,
    previous,
    start,
    stop,
  }));

  return (
    <SpotlightTourContext.Provider value={tour}>
      {isChildFunction(children)
        ? <SpotlightTourContext.Consumer>{children}</SpotlightTourContext.Consumer>
        : <>{children}</>
      }

      <TourOverlay
        backdropOpacity={overlayOpacity}
        color={overlayColor}
        current={current}
        floatingProps={floatingProps}
        motion={motion}
        nativeDriver={nativeDriver}
        onBackdropPress={onBackdropPress}
        padding={spotPadding}
        ref={overlay}
        shape={shape}
        spot={spot}
        tourStep={currentStep}
      />
    </SpotlightTourContext.Provider>
  );
});
