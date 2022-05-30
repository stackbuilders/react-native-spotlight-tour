import React, { useCallback, useImperativeHandle, useRef, useState } from "react";
import { LayoutRectangle } from "react-native";
import { rgbaArray } from "react-native-svg";

import { ChildFn, isChildFunction, isPromise } from "../helpers/common";

import { SpotlightTour, SpotlightTourContext, SpotlightTourCtx, TourStep } from "./SpotlightTour.context";
import { TourOverlay, TourOverlayRef } from "./tour-overlay/TourOverlay.component";

interface SpotlightTourProviderProps {
  children: React.ReactNode | ChildFn<SpotlightTour>;
  overlayColor?: string | number | rgbaArray;
  overlayOpacity?: number | string;
  steps: TourStep[];
  shouldContinueOnBackdropPress?: boolean;
  onStop?: () => void;
}

export const SpotlightTourProvider = React.forwardRef<SpotlightTour, SpotlightTourProviderProps>((props, ref) => {
  const { children, overlayColor, overlayOpacity, steps, onStop } = props;

  const [current, setCurrent] = useState<number>();
  const [spot, setSpot] = useState<LayoutRectangle>();

  const overlayRef = useRef<TourOverlayRef>(null);

  const renderStep = useCallback((index: number) => {
    if (steps[index] !== undefined) {
      const beforeHook = steps[index].before?.();
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
  }, [steps]);

  const changeSpot = (newSpot: LayoutRectangle) => {
    setSpot(newSpot);
  };

  const start = () => {
    renderStep(0);
  };

  const stop = () => {
    setCurrent(undefined);
    onStop?.();
  };

  const next = () => {
    if (current !== undefined && current < steps.length - 1) {
      renderStep(current + 1);
    }
  };

  const previous = () => {
    if (current !== undefined && current > 0) {
      renderStep(current - 1);
    }
  };

  const goTo = (index: number) => {
    renderStep(index);
  };

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
        ref={overlayRef}
        color={overlayColor}
        opacity={overlayOpacity}
        tour={tour}
      />
    </SpotlightTourContext.Provider>
  );
});
