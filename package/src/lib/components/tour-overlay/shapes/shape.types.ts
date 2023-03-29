import { LayoutRectangle, MeasureInWindowOnSuccessCallback } from "react-native";

import { Motion } from "../../../SpotlightTour.context";

interface RefNode {
  measure: (callback: MeasureInWindowOnSuccessCallback) => void;
}

export interface ShapeProps {
  motion: Motion;
  padding: number;
  setReference: (node?: RefNode) => void;
  spot: LayoutRectangle;
  useNativeDriver: boolean;
}
