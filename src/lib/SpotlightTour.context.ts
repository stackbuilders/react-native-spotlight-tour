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

export enum Shape {
  SPOTLIGHT = "spotlight",
  RECTANGLE = "rectangle",
}

export enum Motion {
  SLIDING = 'sliding',
  FADING = 'fading',
}

export type RectangleProps = {
  horizontalRadius?: number;
  verticalRadius?: number;
  borderWidth?: number;
};

export type RenderProps = Pick<SpotlightTourCtx, "next" | "previous" | "stop"> & {
  current: number;
  isFirst: boolean;
  isLast: boolean;
};

export interface TourStep {
  alignTo?: Align;
  before?(): void | Promise<void>;
  render(props: RenderProps): React.ReactNode;
  position: Position;
  shape?: Shape;
  shapeProperties?: RectangleProps;
  motion?: Motion;
}

export interface SpotlightTourCtx {
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

export const SpotlightTourContext = createContext<SpotlightTourCtx>({
  changeSpot: () => undefined,
  goTo: () => undefined,
  next: () => undefined,
  previous: () => undefined,
  start: () => undefined,
  steps: [],
  stop: () => undefined
});

export type SpotlightTour = Omit<SpotlightTourCtx, "changeSpot" | "spot" | "steps">;

export function useSpotlightTour(): SpotlightTour {
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
