import { FlipOptions, Placement, ShiftOptions } from "@floating-ui/react-native";
import { ReactElement, createContext, useContext } from "react";
import { ColorValue, LayoutRectangle } from "react-native";

/**
 * Possible motion effect for the tour spotlight:
 * - `bounce`
 * - `slide`
 * - `fade`
 */
export type Motion = "bounce" | "slide" | "fade";

/**
 * Possible shape for the tour spotlight:
 * - `circle`
 * - `rectangle`
 */
export type Shape = "circle" | "rectangle";

export interface RenderProps {
  /**
   * The index of the current step the tour is on.
   */
  current: number;
  /**
   * Moves to a specific step.
   *
   * @param index the index of the step to go
   */
  goTo: (index: number) => void;
  /**
   * Set to `true` if the tour is on the first step, `false` otherwise.
   */
  isFirst: boolean;
  /**
   * Set to `true` if the tour is on the last step, `false` otherwise.
   */
  isLast: boolean;
  /**
   * Goes to the next step, if any. Stops the tour on the last step.
   */
  next: () => void;
  /**
   * Goes to the previous step, if any.
   */
  previous: () => void;
  /**
   * Terminates the tour execution.
   */
  stop: () => void;
}

export interface OSConfig<T> {
  /**
   * Generic setting which only applies to Android
   */
  android: T;
  /**
   * Generic setting which only applies to iOS
   */
  ios: T;
  /**
   * Generic setting which only applies to Web
   */
  web: T;
}

export type BackdropPressBehavior =
  | "continue"
  | "stop"
  | ((options: SpotlightTour) => void);

export interface StopParams {
  /**
   * Current step index.
   */
  index: number;
  /**
   * `true` if the tour is on the last step, `false` otherwise.
   */
  isLast: boolean;
}

export interface ArrowOptions {
  /**
   * The color of the tooltip arrow.
   *
   * @default white
   */
  color?: ColorValue;
  /**
   * The rounding radius of the arrow tip.
   *
   * @default 2.5
   */
  corner?: number;
  /**
   * The size of the tooltip arrow.
   *
   * @default 16
   */
  size?: number;
}

/**
 * Configuration object which accepts Floating Ui
 * middleware, placement and sameScrollView configurations.
 */
export interface TooltipProps {
  /**
   * Tooltip arrow options. It accepts 3 types of value:
   * - boolean: When `false`, disable rendering the arrow. While `true` renders
   * using the default values.
   * - number: Use it to change the size of the arrow only.
   * - object: Options to further customize the arrow style.
   *
   * @default 20
   */
  arrow?: number | boolean | ArrowOptions;
  /**
   * Enables flipping the placement of the tooltip in order to keep it in view.
   *
   * @default true
   */
  flip?: FlipOptions | boolean;
  /**
   * Offset points between the tooltip and the spotlight.
   *
   * @default 4
   */
  offset?: number;
  /**
   * The placement of the tooltip relative to the spotlight.
   *
   * @default "bottom"
   */
  placement?: Placement;
  /**
   * Enables shifting the tooltip in order to keep it in view.
   *
   * @default { padding: 8 }
   */
  shift?: ShiftOptions | boolean;
}

export interface TourStep extends TooltipProps {
  /**
   * Hook called right before the step starts. Useful to run effects or
   * animations required fo the step to show correctly. If a promise is
   * returned, the promise will be awaited before starting the step.
   *
   * @default undefined
   */
  before?: () => void | Promise<void>;
  /**
   * Specifies the transition motion for the step. You can set the default
   * motion globally on the `SpotlightTourProvider` props too.
   *
   * @default bounce
   */
  motion?: Motion;
  /**
   * Overrides the behavior of pressing the tour's backdrop for this specific
   * step. You can use either one of the following values:
   * - A callback function with the {@link SpotlightTour} options object in the
   * first argument. This allows more granular control over the tour.
   * - The `continue` literal string, which is a shortcut to move to the next
   * step, and stop the tour on the last step.
   * - the `stop` literal string, which is a shortcut to stop the tour.
   *
   * **NOTE:** You can also define a default behavior on the
   * `SpotlightTourProvider` props.
   */
  onBackdropPress?: BackdropPressBehavior;
  /**
   * A function or React function component to render the tooltip of the step.
   * It receives the {@link RenderProps} so you can access the context of the
   * tour within the tooltip.
   */
  render: (props: RenderProps) => ReactElement;
  /**
   * Specifies the spotlight shape for the step. You can set the default shape
   * globally on the `SpotlightTourProvider` props too.
   *
   * @default circle
   */
  shape?: Shape;
}

export interface SpotlightTour {
  /**
   * The current step index.
   */
  current?: number;
  /**
   * Moves to a specific step.
   *
   * @param index the index of the step to go
   */
  goTo: (index: number) => void;
  /**
   * Goes to the next step, if any. Stops the tour on the last step.
   */
  next: () => void;
  /**
   * Goes to the previous step, if any.
   */
  previous: () => void;
  /**
   * Kicks off the tour from step `0`.
   */
  start: () => void;
  /**
   * Terminates the tour execution.
   */
  stop: () => void;
}

export interface SpotlightTourCtx extends SpotlightTour {
  /**
   * Programmatically change the spot layout
   *
   * @param spot the spot layout
   */
  changeSpot: (spot: LayoutRectangle) => void;
  /**
   * The spotlight layout.
   */
  spot: LayoutRectangle;
  /**
   * The list of steps for the tour.
   */
  steps: TourStep[];
}

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

/**
 * React hook to access the {@link SpotlightTour} context.
 *
 * @returns the SpotlightTour context
 */
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
