import React from "react";
import { Animated, ColorValue, LayoutRectangle } from "react-native";
import { Optional } from "../../../helpers/common";
import { BackdropPressBehavior, Motion, OSConfig, TourStep } from "../../SpotlightTour.context";
export interface TourOverlayRef {
    hideTooltip: () => Promise<Animated.EndResult>;
}
interface TourOverlayProps {
    backdropOpacity: number;
    color: ColorValue;
    current: Optional<number>;
    motion: Motion;
    nativeDriver: boolean | OSConfig<boolean>;
    onBackdropPress: Optional<BackdropPressBehavior>;
    padding: number;
    spot: LayoutRectangle;
    tourStep: TourStep;
}
export declare const TourOverlay: React.ForwardRefExoticComponent<TourOverlayProps & React.RefAttributes<TourOverlayRef>>;
export {};
