import React, { useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import { ColorValue, LayoutRectangle } from "react-native";

import { ChildFn, isChildFunction, isPromise } from "../helpers/common";

import { SpotlightTour, SpotlightTourContext, SpotlightTourCtx, TourStep } from "./SpotlightTour.context";
import { TourOverlay, TourOverlayRef } from "./tour-overlay/TourOverlay.component";

interface SpotlightTourProviderProps {
  children: React.ReactNode | ChildFn<SpotlightTour>;
  overlayColor?: ColorValue;
  overlayOpacity?: number | string;
  steps: TourStep[];
}

export const SpotlightTourProvider = React.forwardRef<SpotlightTour, SpotlightTourProviderProps>((props, ref) => {
  const { children, overlayColor, overlayOpacity, steps } = props;

  const [current, setCurrent] = useState<number>();
  const [spot, setSpot] = useState<LayoutRectangle>();

  const overlayRef = useRef<TourOverlayRef>(null);

  const renderStep = useCallback((index: number) => {
    if (steps[index] !== undefined) {
      const beforeHook = steps[index]?.before?.();
      const beforePromise = isPromise(beforeHook)
        ? beforeHook
        : Promise.resolve();

      return Promise.all([
        beforePromise,
        overlayRef.current?.hideTip()
      ])
      .then(() => setCurrent(index));
    }

    return Promise.resolve();
  }, [steps, overlayRef.current]);

  const changeSpot = useCallback((newSpot: LayoutRectangle): void => {
    setSpot(newSpot);
  }, []);

  const start = useCallback((): void => {
    renderStep(0);
  }, [renderStep]);

  const stop = useCallback((): void => {
    setCurrent(undefined);
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

  const currentStep = useMemo((): TourStep | undefined => {
    return current !== undefined
      ? steps[current]
      : undefined;
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

      {spot !== undefined && current !== undefined && currentStep !== undefined && (
        <TourOverlay
          ref={overlayRef}
          color={overlayColor}
          current={current}
          opacity={overlayOpacity}
          spot={spot}
          tourStep={currentStep}
        />
      )}
    </SpotlightTourContext.Provider>
  );
});
