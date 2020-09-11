import React, { useCallback, useImperativeHandle, useState } from "react";
import { LayoutRectangle } from "react-native";
import { rgbaArray } from "react-native-svg";

import { SpotlightTour, SpotlightTourContext, SpotlightTourCtx, TourStep } from "./SpotlightTour.context";
import { TourOverlay } from "./tour-overlay/TourOverlay.component";

type ChildFn = (value: SpotlightTour) => React.ReactNode;

interface SpotlightTourProviderProps {
  children: React.ReactNode | ChildFn;
  overlayColor?: string | number | rgbaArray;
  overlayOpacity?: number | string;
  steps: TourStep[];
}

export const SpotlightTourProvider = React.forwardRef<SpotlightTour, SpotlightTourProviderProps>((props, ref) => {
  const { children, overlayColor, overlayOpacity, steps } = props;

  const [current, setCurrent] = useState<number>();
  const [spot, setSpot] = useState<LayoutRectangle>();

  const changeSpot = useCallback((newSpot: LayoutRectangle) => {
    setSpot(newSpot);
  }, []);

  const start = useCallback(() => {
    setCurrent(0);
  }, []);

  const stop = useCallback(() => {
    setCurrent(undefined);
  }, []);

  const next = useCallback(() => {
    if (current !== undefined && current < steps.length - 1) {
      setCurrent(current + 1);
    }
  }, [current]);

  const previous = useCallback(() => {
    if (current !== undefined && current > 0) {
      setCurrent(current - 1);
    }
  }, [current]);

  const goTo = useCallback((index: number) => {
    if (steps[index] !== undefined) {
      setCurrent(index);
    }
  }, [current]);

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
      {isChildrenFunction(children)
        ? <SpotlightTourContext.Consumer>{children}</SpotlightTourContext.Consumer>
        : children
      }

      <TourOverlay color={overlayColor} opacity={overlayOpacity} tour={tour} />
    </SpotlightTourContext.Provider>
  );
});

function isChildrenFunction(children: React.ReactNode | ChildFn): children is ChildFn {
  if (typeof children === "function") {
    return true;
  }

  return false;
}
