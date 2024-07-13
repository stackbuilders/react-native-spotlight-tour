import { Placement } from "@floating-ui/react-native";
import { View } from "react-native";
import { RuleSet, css } from "styled-components";
import styled from "styled-components/native";

import { Optional } from "../../../helpers/common";
import { vh, vw } from "../../../helpers/responsive";
import { ArrowOptions } from "../../SpotlightTour.context";

interface Position {
  x?: number;
  y?: number;
}

interface TooltipArrowProps {
  placement: Placement;
  position: Optional<Position>;
  size: Optional<number | ArrowOptions>;
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
  border-color: transparent;
  box-sizing: content-box;
  height: 0;
  position: absolute;
  width: 0;
  z-index: -9999;

  ${({ placement, position, size }) => arrowPosition({ placement, position, size })}
`;

function arrowPosition({
  placement,
  position = { },
  size: sizeOrOption,
}: TooltipArrowProps): RuleSet {
  const { x = 0, y = 0 } = position;
  const { color, corner, size } = typeof sizeOrOption === "number"
    ? { ...DEFAULT_ARROW, size: sizeOrOption }
    : { ...DEFAULT_ARROW, ...sizeOrOption };
  const h = Math.sqrt(2 * size ** 2) / 2;
  const height = -h + 0.5;

  switch (placement) {
    case "bottom":
    case "bottom-end":
    case "bottom-start":
      return css`
        border-bottom-width: ${size}px;
        border-left-color: ${color.toString()};
        border-left-width: ${size}px;
        border-top-left-radius: ${corner}px;
        left: ${x + h}px;
        top: ${height}px;
        transform: rotate(45deg);
        transform-origin: top left;
      `;
    case "left":
    case "left-end":
    case "left-start":
      return css`
        border-bottom-width: ${size}px;
        border-right-color: ${color.toString()};
        border-right-width: ${size}px;
        border-top-right-radius: ${corner}px;
        right: ${height}px;
        top: ${y + h}px;
        transform: rotate(45deg);
        transform-origin: top right;
      `;
    case "right":
    case "right-end":
    case "right-start":
      return css`
        border-bottom-left-radius: ${corner}px;
        border-left-color: ${color.toString()};
        border-left-width: ${size}px;
        border-top-width: ${size}px;
        bottom: ${y + h}px;
        left: ${height}px;
        transform: rotate(45deg);
        transform-origin: bottom left;
      `;
    case "top":
    case "top-end":
    case "top-start":
      return css`
        border-bottom-left-radius: ${corner}px;
        border-left-color: ${color.toString()};
        border-left-width: ${size}px;
        border-top-width: ${size}px;
        bottom: ${height}px;
        left: ${x + h}px;
        transform: rotate(-45deg);
        transform-origin: bottom left;
      `;
  }
}
