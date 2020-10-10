import "@testing-library/jest-native/extend-expect";
import { fireEvent, render, RenderAPI, waitFor } from "@testing-library/react-native";
import * as React from "react";

import { checkValidIntersection, findPropsOnTestInstance } from "./helpers/helper";
import { buttonMockMeasureData, viewMockMeasureData } from "./helpers/measures";
import { TestScreen } from "./helpers/TestTour";

async function startTour(): Promise<RenderAPI> {
  const renderer = render(<TestScreen />);

  fireEvent.press(renderer.getByLabelText("Start tour button"));

  await waitFor(() => renderer.getByLabelText("Tour Overlay View"));

  return renderer;
}

describe("Spotlight tour", () => {
  describe("when the tour is not running", () => {
    it("the overlay is not shown", () => {
      const { queryByLabelText } = render(<TestScreen />);
      expect(queryByLabelText("Tour Overlay View")).toBeNull();
    });

    describe("and the start button is pressed", () => {
      it("shows the overlay view", async () => {
        const { getByLabelText } = render(<TestScreen />);

        fireEvent.press(getByLabelText("Start tour button"));

        await waitFor(() => getByLabelText("Tour Overlay View"));
      });
    });
  });

  describe("when the tour overlay starts", () => {
    describe("and the tour moves to the first spot", () => {
      it("wraps the component with the SVG circle", async () => {
        const { getByLabelText } = render(<TestScreen />);
        fireEvent.press(getByLabelText("Start tour button"));

        fireEvent(getByLabelText("Tip Overlay View"), "onLayout", {
          nativeEvent: {
            layout: {
              height: viewMockMeasureData.height,
              width: viewMockMeasureData.width
            }
          }
        });

        await waitFor(() => getByLabelText("Svg overlay view"));

        const svgCircleProps = findPropsOnTestInstance(
          getByLabelText("Svg overlay view"),
          "RNSVGCircle"
        );

        const layoutIsOverlayByCircle = checkValidIntersection({
            height: viewMockMeasureData.height,
            width: viewMockMeasureData.width,
            x: viewMockMeasureData.x,
            y: viewMockMeasureData.y
          }, {
            r: svgCircleProps?.r,
            x: svgCircleProps?.cx,
            y: svgCircleProps?.cy
          });

        expect(layoutIsOverlayByCircle).toBeTruthy();
      });

      it("adds the tip view on the right position", async () => {
        const { getByLabelText } = render(<TestScreen />);
        fireEvent.press(getByLabelText("Start tour button"));

        fireEvent(getByLabelText("Tip Overlay View"), "onLayout", {
          nativeEvent: {
            layout: {
              height: viewMockMeasureData.height,
              width: viewMockMeasureData.width
            }
          }
        });

        await waitFor(() => getByLabelText("Svg overlay view"));

        expect(getByLabelText("Tip Overlay View")).toHaveStyle({
          left: 275,
          marginTop: "2%",
          position: "absolute",
          top: 431
        });
      });
    });

    describe("and the tour moves to the second spot", () => {
      it("wraps the component with the SVG circle", async () => {
        const { getByLabelText } = render(<TestScreen />);
        fireEvent.press(getByLabelText("Start tour button"));
        fireEvent.press(getByLabelText("Next spot button"));

        fireEvent(getByLabelText("Tip Overlay View"), "onLayout", {
          nativeEvent: {
            layout: {
              height: buttonMockMeasureData.height,
              width: buttonMockMeasureData.width
            }
          }
        });

        await waitFor(() => getByLabelText("Svg overlay view"));

        const svgCircleProps = findPropsOnTestInstance(
          getByLabelText("Svg overlay view"),
          "RNSVGCircle"
        );

        const layoutIsOverlayByCircle = checkValidIntersection({
            height: buttonMockMeasureData.height,
            width: buttonMockMeasureData.width,
            x: buttonMockMeasureData.x,
            y: buttonMockMeasureData.y
          }, {
            r: svgCircleProps?.r,
            x: svgCircleProps?.cx,
            y: svgCircleProps?.cy
          });

        expect(layoutIsOverlayByCircle).toBeTruthy();
      });

      it("adds the second tip view on the right position", async () => {
        const { getByLabelText } = render(<TestScreen />);
        fireEvent.press(getByLabelText("Start tour button"));
        fireEvent.press(getByLabelText("Next spot button"));

        fireEvent(getByLabelText("Tip Overlay View"), "onLayout", {
          nativeEvent: {
            layout: {
              height: buttonMockMeasureData.height,
              width: buttonMockMeasureData.width
            }
          }
        });

        await waitFor(() => getByLabelText("Svg overlay view"));

        expect(getByLabelText("Tip Overlay View")).toHaveStyle({
          left: 10,
          marginBottom: "2%",
          position: "absolute",
          top: -72
        });
      });
    });
  });

  describe("and when the tour finishes", () => {
    it("stops the tour and hides the overlay view", async () => {
      const { getByLabelText, queryByLabelText } = await startTour();

      await waitFor(() => getByLabelText("Svg overlay view"));

      fireEvent.press(getByLabelText("Stop tour button"));

      expect(queryByLabelText("Tour Overlay View")).toBeNull();
    });
  });
});
