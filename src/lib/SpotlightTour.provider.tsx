import React, { useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import { ColorValue, LayoutRectangle } from "react-native";

import { ChildFn, isChildFunction, isPromise } from "../helpers/common";

import { Position, SpotlightTour, SpotlightTourContext, SpotlightTourCtx, TourStep } from "./SpotlightTour.context";
import { TourOverlay, TourOverlayRef } from "./tour-overlay/TourOverlay.component";

export interface OSConfig<T> {
  android: T;
  ios: T;
}

interface SpotlightTourProviderProps {
  /**
   * The children to render in the provider. It accepts either a React
   * component, or a function that returns a React component. When the child is
   * a funtion, the `SpotlightTour` context can be accessed from the first
   * argument.
   */
  children: React.ReactNode | ChildFn<SpotlightTour>;
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
   * An array of `TourStep` objects that define each step of the tour.
   */
  steps: TourStep[];
  /**
   * Define if the animations in the tour should use the native driver or not.
   * A boolean can be used to apply the same value to both Android and iOS, or
   * an object with `android` and `ios` keys can be used to define a value for
   * each OS.
   *
   * @default false
   */
  nativeDriver?: boolean | OSConfig<boolean>;
}

const ZERO_SPOT: LayoutRectangle = {
  height: 0,
  width: 0,
  x: 0,
  y: 0
};

export const SpotlightTourProvider = React.forwardRef<SpotlightTour, SpotlightTourProviderProps>((props, ref) => {
  const {
    children,
    overlayColor = "black",
    overlayOpacity = 0.45,
    steps,
    nativeDriver = false
  } = props;

  const [current, setCurrent] = useState<number>();
  const [spot, setSpot] = useState(ZERO_SPOT);

  const overlay = useRef<TourOverlayRef>({
    hideTooltip: () => Promise.resolve({ finished: false })
  });

  const renderStep = useCallback((index: number) => {
    if (steps[index] !== undefined) {
      const beforeResult = steps[index]?.before?.();
      const beforePromise = isPromise(beforeResult)
        ? beforeResult
        : Promise.resolve();

      return Promise.all([
        beforePromise,
        overlay.current.hideTooltip()
      ])
      .then(() => setCurrent(index));
    }

    return Promise.resolve();
  }, [steps]);

  const changeSpot = useCallback((newSpot: LayoutRectangle): void => {
    setSpot(newSpot);
  }, []);

  const start = useCallback((): void => {
    renderStep(0);
  }, [renderStep]);

  const stop = useCallback((): void => {
    setCurrent(undefined);
    setSpot(ZERO_SPOT);
  }, []);

  const next = useCallback((): void => {
    if (current !== undefined && current < steps.length - 1) {
      renderStep(current + 1);
    }
  }, [renderStep, current, steps.length]);

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

    return step ?? { position: Position.BOTTOM, render: () => <></> };
  }, [steps, current]);

  const tour: SpotlightTourCtx = {
    changeSpot,
    current,
    goTo,
    next,
    previous,
    spot,
    start,
    steps,
    stop
  };

  useImperativeHandle(ref, () => ({
    current,
    goTo,
    next,
    previous,
    start,
    stop
  }));

  return (
    <SpotlightTourContext.Provider value={tour}>
      {isChildFunction(children)
        ? <SpotlightTourContext.Consumer>{children}</SpotlightTourContext.Consumer>
        : <>{children}</>
      }

      <TourOverlay
        ref={overlay}
        color={overlayColor}
        current={current}
        opacity={overlayOpacity}
        spot={spot}
        tourStep={currentStep}
        nativeDriver={nativeDriver}
      />
    </SpotlightTourContext.Provider>
  );
});
