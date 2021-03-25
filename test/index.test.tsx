import "@testing-library/jest-native/extend-expect";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import * as React from "react";
import { TourStep } from "../src";

import { checkValidIntersection, findPropsOnTestInstance } from "./helpers/helper";
import { buttonMockMeasureData, viewMockMeasureData } from "./helpers/measures";
import { BASE_STEP, TestScreen } from "./helpers/TestTour";

describe("Spotlight tour", () => {
  describe("when the tour is not running", () => {
    it("the overlay is not shown", async () => {
      const { getByText, queryByLabelText } = render(<TestScreen />);

      await waitFor(() => getByText("Start"));

      expect(queryByLabelText("Tour Overlay View")).toBeNull();
    });

    describe("and the start button is pressed", () => {
      it("shows the overlay view", async () => {
        const { getByText, getByLabelText } = render(<TestScreen />);

        await waitFor(() => getByText("Start"));

        fireEvent.press(getByText("Start"));

        await waitFor(() => getByLabelText("Tour Overlay View"));
      });
    });
  });

  describe("when the tour is running", () => {
    describe("and the tour moves to the first spot", () => {
      it("wraps the component with the SVG circle", async () => {
        const { getByText, getByLabelText } = render(<TestScreen />);

        await waitFor(() => getByText("Start"));

        fireEvent.press(getByText("Start"));

        await waitFor(() => getByLabelText("Tip Overlay View"));

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

        expect(layoutIsOverlayByCircle).toEqual(true);
      });

      it("adds the tip view on the right position", async () => {
        const { getByText, getByLabelText } = render(<TestScreen />);

        await waitFor(() => getByText("Start"));

        fireEvent.press(getByText("Start"));

        await waitFor(() => getByLabelText("Tip Overlay View"));

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
        const { getByText, getByLabelText } = render(<TestScreen />);

        await waitFor(() => getByText("Start"));

        fireEvent.press(getByText("Start"));

        await waitFor(() => getByText("Step 1"));

        fireEvent.press(getByText("Next"));

        await waitFor(() => getByText("Step 2"));

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

        expect(layoutIsOverlayByCircle).toEqual(true);
      });

      it("adds the second tip view on the right position", async () => {
        const { getByText, getByLabelText } = render(<TestScreen />);

        await waitFor(() => getByText("Start"));

        fireEvent.press(getByText("Start"));

        await waitFor(() => getByText("Step 1"));

        fireEvent.press(getByText("Next"));

        await waitFor(() => getByText("Step 2"));

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
          left: 325,
          marginBottom: "2%",
          position: "absolute",
          top: -72
        });
      });
    });
  });

  describe("and the tour is stopped", () => {
    it("unmounts the overlay view", async () => {
      const { getByText, queryByLabelText } = render(<TestScreen />);

      await waitFor(() => getByText("Start"));

      fireEvent.press(getByText("Start"));

      await waitFor(() => getByText("Step 1"));

      fireEvent.press(getByText("Stop"));

      expect(queryByLabelText("Tour Overlay View")).toBeNull();
    });
  });

  describe("and the step has a before hook", () => {
    describe("and the hook does NOT return a promise", () => {
      it("runs the hook before going to the next step", async () => {
        const beforeSpy = jest.fn(() => undefined);
        const steps: TourStep[] = [
          BASE_STEP,
          { ...BASE_STEP, before: beforeSpy }
        ];
        const { getByText } = render(<TestScreen steps={steps} />);
  
        await waitFor(() => getByText("Start"));
  
        fireEvent.press(getByText("Start"));
  
        await waitFor(() => {
          expect(beforeSpy).not.toBeCalled();
          getByText("Step 1");
        });
  
        fireEvent.press(getByText("Next"));
  
        await waitFor(() => {
          expect(beforeSpy).toBeCalledTimes(1);
          getByText("Step 2");
        });
      });
    });

    describe("and the hook returns a promise", () => {
      describe("and the promise is resolved", () => {
        it("runs the hook before going to the next step", async () => {
          const beforeSpy = jest.fn(() => Promise.resolve());
          const steps: TourStep[] = [
            BASE_STEP,
            { ...BASE_STEP, before: beforeSpy }
          ];
          const { getByText } = render(<TestScreen steps={steps} />);
    
          await waitFor(() => getByText("Start"));
    
          fireEvent.press(getByText("Start"));
    
          await waitFor(() => {
            expect(beforeSpy).not.toBeCalled();
            getByText("Step 1");
          });
    
          fireEvent.press(getByText("Next"));
    
          await waitFor(() => {
            expect(beforeSpy).toBeCalledTimes(1);
            getByText("Step 2");
          });
        });
      });

      describe("and the promise is rejected", () => {
        it("does NOT move to the next step", async () => {
          const beforeSpy = jest.fn(() => Promise.reject(new Error("Fail!")));
          const steps: TourStep[] = [
            BASE_STEP,
            { ...BASE_STEP, before: beforeSpy }
          ];
          const { getByText, queryByText } = render(<TestScreen steps={steps} />);
    
          await waitFor(() => getByText("Start"));
    
          fireEvent.press(getByText("Start"));
    
          await waitFor(() => {
            expect(beforeSpy).not.toBeCalled();
            getByText("Step 1");
          });
    
          fireEvent.press(getByText("Next"));

          await waitFor(() => {
            expect(beforeSpy).toBeCalledTimes(1);
            expect(queryByText("Step 2")).toBeNull();
          });
        });
      });
    });
  });
});
