import { createContext, useContext } from "react";
import { LayoutRectangle } from "react-native";

export enum AlignTo{
  SPOT = "spot",
  SCREEN = "screen",
}

enum Position {
  TOP = "top",
  LEFT = "left",
  BOTTOM = "bottom",
  RIGHT = "right",
}

export type RenderProps = Pick<Tour, "next" | "previous" | "stop"> & {
  current: number;
  isFirst: boolean;
  isLast: boolean;
};
export interface TourStep {
  alignTo?: AlignTo;
  render(props: RenderProps): React.ReactNode;
  position: Position;
}

export interface Tour {
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

export const TourContext = createContext<Tour>({
  changeSpot: () => undefined,
  goTo: () => undefined,
  next: () => undefined,
  previous: () => undefined,
  start: () => undefined,
  steps: [],
  stop: () => undefined
});

export function useTour(): Tour {
  return useContext(TourContext);
}
