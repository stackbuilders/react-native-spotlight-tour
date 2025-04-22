import { MiddlewareData, Placement } from "@floating-ui/react-native";
import { Platform, StyleSheet, ViewStyle } from "react-native";

import { Optional } from "../../../helpers/common";
import { vh, vw } from "../../../helpers/responsive";
import { ArrowOptions } from "../../SpotlightTour.context";

interface TooltipArrowProps {
  arrow: Optional<number | ArrowOptions>;
  data: Optional<MiddlewareData["arrow"]>;
  placement: Placement;
}

export const DEFAULT_ARROW: Required<ArrowOptions> = {
  color: "white",
  corner: 2.5,
  size: 16,
};

export const Css = StyleSheet.create({
  overlayView: {
    height: vh(100),
    width: vw(100),
  },
  tooltipArrow: {
    backgroundColor: "transparent",
    height: 0,
    position: "absolute",
    width: 0,
    zIndex: -9999,
  },
});

export function arrowCss({ arrow, data, placement }: TooltipArrowProps): ViewStyle {
  const { x = 0, y = 0 } = data ?? { };
  const { color, corner, size } = typeof arrow === "number"
    ? { ...DEFAULT_ARROW, size: arrow }
    : { ...DEFAULT_ARROW, ...arrow };
  // Android cannot apply specific border + radius:
  // https://github.com/facebook/react-native/issues/9262
  const radius = Platform.OS === "android" ? 0 : corner;
  const h = Math.sqrt(2 * size ** 2) / 2;
  const height = -h + 0.5;

  switch (placement) {
    case "bottom":
    case "bottom-end":
    case "bottom-start":
      return {
        borderBottomColor: "transparent",
        borderBottomWidth: size,
        borderLeftColor: color,
        borderLeftWidth: size,
        borderTopLeftRadius: radius,
        left: x + h,
        top: height,
        transform: [{ rotate: "45deg" }],
        transformOrigin: "top left",
      };
    case "left":
    case "left-end":
    case "left-start":
      return {
        borderBottomColor: "transparent",
        borderBottomWidth: size,
        borderRightColor: color,
        borderRightWidth: size,
        borderTopRightRadius: radius,
        right: height,
        top: y + h,
        transform: [{ rotate: "45deg" }],
        transformOrigin: "top right",
      };
    case "right":
    case "right-end":
    case "right-start":
      return {
        borderBottomColor: "transparent",
        borderBottomWidth: size,
        borderLeftColor: color,
        borderLeftWidth: size,
        borderTopLeftRadius: radius,
        left: height,
        top: y + h,
        transform: [{ rotate: "-45deg" }],
        transformOrigin: "top left",
      };
    case "top":
    case "top-end":
    case "top-start":
      return {
        borderBottomColor: color,
        borderBottomLeftRadius: radius,
        borderBottomWidth: size,
        borderLeftColor: color,
        borderRightColor: "transparent",
        borderRightWidth: size,
        bottom: height,
        left: x + h,
        transform: [{ rotate: "-45deg" }],
        transformOrigin: "bottom left",
      };
  }
}
