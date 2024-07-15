import { MiddlewareData, Placement } from "@floating-ui/react-native";
import { Platform, View } from "react-native";
import { css } from "styled-components";
import styled from "styled-components/native";

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

export const OverlayView = styled.View`
  height: ${vh(100)};
  width: ${vw(100)};
`;

export const TooltipArrow = styled(View)<TooltipArrowProps>`
  background-color: transparent;
  height: 0;
  position: absolute;
  width: 0;
  z-index: -9999;

  ${({ arrow, placement, data }) => {
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
        return css`
          border-bottom-color: transparent;
          border-bottom-width: ${size}px;
          border-left-color: ${color.toString()};
          border-left-width: ${size}px;
          border-top-left-radius: ${radius}px;
          left: ${x + h}px;
          top: ${height}px;
          transform: rotate(45deg);
          transform-origin: top left;
        `;
      case "left":
      case "left-end":
      case "left-start":
        return css`
          border-bottom-color: transparent;
          border-bottom-width: ${size}px;
          border-right-color: ${color.toString()};
          border-right-width: ${size}px;
          border-top-right-radius: ${radius}px;
          right: ${height}px;
          top: ${y + h}px;
          transform: rotate(45deg);
          transform-origin: top right;
        `;
      case "right":
      case "right-end":
      case "right-start":
        return css`
          border-bottom-color: transparent;
          border-bottom-width: ${size}px;
          border-left-color: ${color.toString()};
          border-left-width: ${size}px;
          border-top-left-radius: ${radius}px;
          left: ${height}px;
          top: ${y + h}px;
          transform: rotate(-45deg);
          transform-origin: top left;
        `;
      case "top":
      case "top-end":
      case "top-start":
        return css`
          border-bottom-color: ${color.toString()};
          border-bottom-left-radius: ${radius}px;
          border-bottom-width: ${size}px;
          border-left-color: ${color.toString()};
          border-right-color: transparent;
          border-right-width: ${size}px;
          bottom: ${height}px;
          left: ${x + h}px;
          transform: rotate(-45deg);
          transform-origin: bottom left;
        `;
    }
  }}
`;
