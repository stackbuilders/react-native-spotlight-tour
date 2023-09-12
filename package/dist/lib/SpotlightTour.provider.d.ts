import React from "react";
import { ColorValue } from "react-native";
import { ChildFn } from "../helpers/common";
import { BackdropPressBehavior, Motion, OSConfig, StopParams, SpotlightTour, TourStep, FloatingProps } from "./SpotlightTour.context";
export interface SpotlightTourProviderProps {
    /**
     * The children to render in the provider. It accepts either a React
     * component, or a function that returns a React component. When the child is
     * a funtion, the `SpotlightTour` context can be accessed from the first
     * argument.
     */
    children: React.ReactNode | ChildFn<SpotlightTour>;
    /**
     * Specifies {@link FloatingProps} in order to configure Floating UI
     * in all tour steps layout.
     *
     * @default middlewares: [flip(), offset(4), shift()]
     * @default placement: "bottom"
     */
    floatingProps?: FloatingProps;
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
     * first argument. This allows more franular control over the tour.
     * - The `continue` literal string, which is a shortcut to move to the next
     * step, and stop the tour on the last step.
     * - the `stop` literal string, which is a shortcut to stop the tour.
     *
     * **NOTE:** You can also override this behavior on each step configuration.
     */
    onBackdropPress?: BackdropPressBehavior;
    /**
     * Handler which gets executed when {@link SpotlightTour.stop|stop} is
     * invoked. It receives the {@link StopParams} so
     * you can access the `current` step index where the tour stopped
     * and a bool value `isLast` indicating if the step where the tour stopped is
     * the last one.
     */
    onStop?: (values: StopParams) => void;
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
     * Defines the padding of the spot shape based on the wrapped component, so a
     * zero padding means the spot shape will fit exaclty around the wrapped
     * component. The padding value is a number in points.
     *
     * @default 16;
     */
    spotPadding?: number;
    /**
     * An array of `TourStep` objects that define each step of the tour.
     */
    steps: TourStep[];
}
/**
 * React provider component to get access to the SpotlightTour context.
 */
export declare const SpotlightTourProvider: React.ForwardRefExoticComponent<SpotlightTourProviderProps & React.RefAttributes<SpotlightTour>>;
