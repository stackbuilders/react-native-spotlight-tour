import React from "react";
import { Motion, TourStep } from "../../../SpotlightTour.context";
interface CircleShapeProps {
    motion: Motion;
    padding: number;
    tourStep: TourStep;
    useNativeDriver: boolean;
}
export declare const CircleShape: React.NamedExoticComponent<CircleShapeProps>;
export {};
