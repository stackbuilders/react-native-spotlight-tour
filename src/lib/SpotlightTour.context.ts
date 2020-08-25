import { createContext, useContext } from "react";
import { LayoutRectangle, Omit } from "react-native";

export enum Align {
  SCREEN = "screen",
  SPOT = "spot"
}

export enum Position {
  BOTTOM = "bottom",
  LEFT = "left",
  RIGHT = "right",
  TOP = "top"
}

export type RenderProps = Pick<SpotlightTour, "next" | "previous" | "stop"> & {
  current: number;
  isFirst: boolean;
  isLast: boolean;
};

export interface TourStep {
  alignTo?: Align;
  render(props: RenderProps): React.ReactNode;
  position: Position;
}

export interface SpotlightTour {
  changeSpot(spot: LayoutRectangle): void;
  current?: number;
  goTo(index: number): void;
  next(): void;
  previous(): void;
  spot?: LayoutRectangle;
  start(): void;
  steps: TourStep[];
  stop(): void;
}

export const SpotlightTourContext = createContext<SpotlightTour>({
  changeSpot: () => undefined,
  goTo: () => undefined,
  next: () => undefined,
  previous: () => undefined,
  start: () => undefined,
  steps: [],
  stop: () => undefined
});

export function useSpotlightTour(): Omit<SpotlightTour, "changeSpot" | "spot" | "steps"> {
  const { current, goTo, next, previous, start, stop } = useContext(SpotlightTourContext);

  return {
    current,
    goTo,
    next,
    previous,
    start,
    stop
  };
}
