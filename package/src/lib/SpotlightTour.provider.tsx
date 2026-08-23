import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { type ChildFn, isChildFunction } from "../helpers/common";

import {
  type BackdropPressBehavior,
  type Motion,
  type OSConfig,
  type Shape,
  type ShapeOptions,
  type SpotlightTour,
  SpotlightTourContext,
  type SpotlightTourCtx,
  type TooltipProps,
  type TourState,
  type TourStatus,
  type TourStep,
  ZERO_SPOT,
} from "./SpotlightTour.context";
import { TourOverlay, type TourOverlayRef } from "./components/tour-overlay/TourOverlay.component";

import type { ColorValue, LayoutRectangle } from "react-native";

export interface SpotlightTourProviderProps extends TooltipProps {
  /**
   * The children to render in the provider. It accepts either a React
   * component, or a function that returns a React component. When the child is
   * a function, the `SpotlightTour` context can be accessed from the first
   * argument.
   */
  children: ChildFn<SpotlightTour> | React.ReactNode;
  /**
   * Additional y position around the spotlight target point to account for
   * UI elements like status bars or navigation bars, especially when using
   * translucent or edge-to-edge modes. This creates extra space between the
   * target element and the spotlight mask.
   *
   * @default 0
   */
  maskOffset?: number;
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
   * Handler which gets executed when {@link SpotlightTour.pause|pause} is
   * invoked. It receives the {@link TourState} so
   * you can access the step index where the tour paused.
   */
  onPause?: (values: TourState) => void;
  /**
   * Handler which gets executed when {@link SpotlightTour.resume|resume} is
   * invoked. It receives the {@link ResumeParams} so
   * you can access the step index where the tour resumed.
   */
  onResume?: (values: TourState) => void;
  /**
   * Handler which gets executed when {@link SpotlightTour.stop|stop} is
   * invoked. It receives the {@link TourState} so
   * you can access the `current` step index where the tour stopped
   * and a bool value `isLast` indicating if the step where the tour stopped is
   * the last one.
   */
  onStop?: (values: TourState) => void;
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
   * Configures the default spotlight shape for all steps. You can override
   * this value on each step too.
   *
   * @default circle
   */
  shape?: Shape | ShapeOptions;
  /**
   * An array of `TourStep` objects that define each step of the tour.
   */
  steps: TourStep[];
  /**
   * Android only: Enable translucent status and navigation bars to allow the
   * tour overlay to extend behind system bars. Uses react-native-edge-to-edge
   * internally to handle the translucent bars setup.
   *
   * @platform android
   * @default false
   */
  translucent?: boolean;
}

/**
 * React provider component to get access to the SpotlightTour context.
 */
export const SpotlightTourProvider = forwardRef<SpotlightTour, SpotlightTourProviderProps>((props, ref) => {
  const {
    arrow,
    children,
    flip,
    maskOffset = 0,
    motion = "bounce",
    nativeDriver = true,
    offset,
    onBackdropPress,
    onPause,
    onResume,
    onStop,
    overlayColor = "black",
    overlayOpacity = 0.45,
    placement,
    shape = "circle",
    shift,
    steps,
    translucent,
  } = props;

  const [current, setCurrent] = useState<number>();
  const [spot, setSpot] = useState(ZERO_SPOT);
  const [pausedAt, setPausedAt] = useState<number>();

  const overlay = useRef<TourOverlayRef>({
    hideTooltip: () => Promise.resolve({ finished: false }),
  });

  const status = useMemo((): TourStatus => {
    if (current === undefined) {
      return pausedAt !== undefined
        ? "paused"
        : "idle";
    }

    return "running";
  }, [current, pausedAt]);

  const currentStep = useMemo((): TourStep => {
    const step = current !== undefined
      ? steps[current]
      : undefined;

    return step ?? { render: () => <></> };
  }, [steps, current]);

  const renderStep = useCallback((index: number): void => {
    const step = steps[index];

    if (step !== undefined) {
      Promise.all([
        overlay.current.hideTooltip(),
        Promise.resolve().then(step.before),
      ])
        .then(() => setCurrent(index));
    }
  }, [steps]);

  const changeSpot = useCallback((newSpot: LayoutRectangle): void => {
    setSpot(newSpot);
  }, []);

  const start = useCallback((): void => {
    renderStep(0);
  }, [renderStep]);

  const stop = useCallback((): void => {
    setCurrent(prev => {
      if (prev !== undefined) {
        onStop?.({
          index: prev,
          isLast: prev === steps.length - 1,
        });
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

  const pause = useCallback((): void => {
    setCurrent(prev => {
      if (prev !== undefined) {
        setPausedAt(prev);
        onPause?.({
          index: prev,
          isLast: prev === steps.length - 1,
        });
      }

      return undefined;
    });
  }, [onPause, steps.length]);

  const resume = useCallback((): void => {
    const index = pausedAt ?? 0;
    const isLast = index === steps.length - 1;

    goTo(index);
    setPausedAt(undefined);
    onResume?.({ index, isLast });
  }, [goTo, onResume, pausedAt, steps.length]);

  const tour = useMemo((): SpotlightTourCtx => ({
    changeSpot,
    current,
    goTo,
    next,
    pause,
    previous,
    resume,
    spot,
    start,
    status,
    steps,
    stop,
  }), [changeSpot, current, goTo, next, previous, spot, start, steps, stop, pause]);

  useImperativeHandle(ref, () => ({
    current,
    goTo,
    next,
    pause,
    previous,
    resume,
    start,
    status,
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
        maskOffset={maskOffset}
        motion={motion}
        nativeDriver={nativeDriver}
        onBackdropPress={onBackdropPress}
        ref={overlay}
        shape={shape}
        spot={spot}
        tourStep={currentStep}
        arrow={arrow}
        flip={flip}
        offset={offset}
        placement={placement}
        shift={shift}
        translucent={translucent}
      />
    </SpotlightTourContext.Provider>
  );
});
