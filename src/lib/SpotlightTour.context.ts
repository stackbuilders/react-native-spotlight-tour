import { createContext, ReactElement, useContext } from "react";
import { LayoutRectangle, Omit } from "react-native";

export enum Align {
  SCREEN = "screen",
  SPOT = "spot",
}

export enum Position {
  BOTTOM = "bottom",
  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
}

export type RenderProps = Pick<SpotlightTourCtx, "next" | "previous" | "stop"> & {
  current: number;
  isFirst: boolean;
  isLast: boolean;
};

export interface TourStep {
  alignTo?: Align;
  before?: () => void | Promise<void>;
  render: (props: RenderProps) => ReactElement;
  position: Position;
}

export interface SpotlightTourCtx {
  changeSpot: (spot: LayoutRectangle) => void;
  current?: number;
  goTo: (index: number) => void;
  next: () => void;
  previous: () => void;
  spot: LayoutRectangle;
  start: () => void;
  steps: TourStep[];
  stop: () => void;
}

export type SpotlightTour = Omit<SpotlightTourCtx, "changeSpot" | "spot" | "steps">;

export const ZERO_SPOT: LayoutRectangle = {
  height: 0,
  width: 0,
  x: 0,
  y: 0,
};

export const SpotlightTourContext = createContext<SpotlightTourCtx>({
  changeSpot: () => undefined,
  goTo: () => undefined,
  next: () => undefined,
  previous: () => undefined,
  spot: ZERO_SPOT,
  start: () => undefined,
  steps: [],
  stop: () => undefined,
});

export function useSpotlightTour(): SpotlightTour {
  const { current, goTo, next, previous, start, stop } = useContext(SpotlightTourContext);

  return {
    current,
    goTo,
    next,
    previous,
    start,
    stop,
  };
}
