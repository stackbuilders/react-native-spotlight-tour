export type { ChildFn, OmitR, Optional, ToOptional } from "./helpers/common";
export type { AttachStepProps, ChildProps } from "./lib/components/attach-step/AttachStep.component";
export { AttachStep } from "./lib/components/attach-step/AttachStep.component";
export type { TourBoxProps } from "./lib/components/tour-box/TourBox.component";
export { TourBox } from "./lib/components/tour-box/TourBox.component";
export type { BackdropPressBehavior,
  Motion,
  OSConfig,
  RenderProps,
  Shape,
  ShapeOptions,
  SpotlightTour,
  TourState,
  TooltipProps,
  TourStatus,
  TourStep,
} from "./lib/SpotlightTour.context";
export { useSpotlightTour } from "./lib/SpotlightTour.context";
export type { SpotlightTourProviderProps } from "./lib/SpotlightTour.provider";
export { SpotlightTourProvider } from "./lib/SpotlightTour.provider";
export {
  autoPlacement,
  arrow,
  hide,
  inline,
  flip,
  offset,
  shift,
} from "@floating-ui/react-native";
