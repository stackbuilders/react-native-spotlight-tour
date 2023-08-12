import "@testing-library/jest-native/extend-expect";

import { expect as jestExpect } from "@jest/globals";
import { expect } from "@stackbuilders/assertive-ts";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { CircleProps } from "react-native-svg";

import { TourStep } from "../../src";
import { BASE_STEP, TestScreen } from "../helpers/TestTour";
import { checkValidIntersection, findPropsOnTestInstance } from "../helpers/helper";
import { buttonMockMeasureData, viewMockMeasureData } from "../helpers/measures";
import { setMeasureRect } from "../setup";

describe("[Integration] index.test.tsx", () => {
  describe("when the tour is not running", () => {
    it("the overlay is not shown", async () => {
      const { getByText, queryByTestId } = render(<TestScreen />);

      await waitFor(() => getByText("Start"));

      expect(queryByTestId("Overlay View")).toBeNull();
    });

    describe("and the start button is pressed", () => {
      it("shows the overlay view", async () => {
        const { getByText, getByTestId } = render(<TestScreen />);

        await waitFor(() => getByText("Start"));

        fireEvent.press(getByText("Start"));

        await waitFor(() => getByTestId("Overlay View"));
      });
    });
  });

  describe("when the tour is running", () => {
    describe("and the tour moves to the first spot", () => {
      it("wraps the component with the SVG circle", async () => {
        const { findByText, findByTestId } = render(<TestScreen />);

        const startButton = await findByText("Start");

        fireEvent.press(startButton);

        const tooltip = await findByTestId("Tooltip View");

        fireEvent(tooltip, "onLayout", {
          nativeEvent: {
            layout: {
              height: viewMockMeasureData.height,
              width: viewMockMeasureData.width,
            },
          },
        });

        const spot = await findByTestId("Spot Svg");

        await waitFor(() => {
          const svgCircleProps = findPropsOnTestInstance<CircleProps>(spot, "RNSVGCircle");

          checkValidIntersection({
            height: viewMockMeasureData.height,
            width: viewMockMeasureData.width,
            x: viewMockMeasureData.x,
            y: viewMockMeasureData.y,
          }, {
            r: Number(svgCircleProps?.r),
            x: Number(svgCircleProps?.cx),
            y: Number(svgCircleProps?.cy),
          });
        });
      });
    });

    describe("and the tour moves to the second spot", () => {
      it("wraps the component with the SVG circle", async () => {
        const { getByText, getByTestId } = render(<TestScreen />);

        await waitFor(() => getByText("Start"));

        fireEvent.press(getByText("Start"));

        await waitFor(() => getByText("Step 1"));

        setMeasureRect(buttonMockMeasureData);

        fireEvent.press(getByText("Next"));

        await waitFor(() => getByText("Step 2"));

        fireEvent(getByTestId("Tooltip View"), "onLayout", {
          nativeEvent: {
            layout: {
              height: buttonMockMeasureData.height,
              width: buttonMockMeasureData.width,
            },
          },
        });

        await waitFor(() => {
          const svgCircleProps = findPropsOnTestInstance<CircleProps>(getByTestId("Spot Svg"), "RNSVGCircle");

          checkValidIntersection({
            height: buttonMockMeasureData.height,
            width: buttonMockMeasureData.width,
            x: buttonMockMeasureData.x,
            y: buttonMockMeasureData.y,
          }, {
            r: Number(svgCircleProps?.r),
            x: Number(svgCircleProps?.cx),
            y: Number(svgCircleProps?.cy),
          });
        });
      });
    });
  });

  describe("when the tour is stopped", () => {
    it("unmounts the overlay view", async () => {
      const { getByText, queryByTestId } = render(<TestScreen />);

      await waitFor(() => getByText("Start"));

      fireEvent.press(getByText("Start"));

      await waitFor(() => getByText("Step 1"));

      fireEvent.press(getByText("Stop"));

      expect(queryByTestId("Overlay View")).toBeNull();
    });
  });

  describe("and the step has a before hook", () => {
    describe("and the hook does NOT return a promise", () => {
      it("runs the hook before going to the next step", async () => {
        const beforeSpy = jest.fn(() => undefined);
        const steps: TourStep[] = [
          BASE_STEP,
          { ...BASE_STEP, before: beforeSpy },
        ];
        const { getByText } = render(<TestScreen steps={steps} />);

        await waitFor(() => getByText("Start"));

        fireEvent.press(getByText("Start"));

        await waitFor(() => {
          jestExpect(beforeSpy).not.toBeCalled();
          getByText("Step 1");
        });

        fireEvent.press(getByText("Next"));

        await waitFor(() => {
          jestExpect(beforeSpy).toBeCalledTimes(1);
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
            { ...BASE_STEP, before: beforeSpy },
          ];
          const { getByText } = render(<TestScreen steps={steps} />);

          await waitFor(() => getByText("Start"));

          fireEvent.press(getByText("Start"));

          await waitFor(() => {
            jestExpect(beforeSpy).not.toBeCalled();
            getByText("Step 1");
          });

          fireEvent.press(getByText("Next"));

          await waitFor(() => {
            jestExpect(beforeSpy).toBeCalledTimes(1);
            getByText("Step 2");
          });
        });
      });

      /**
       * Jest changed the behavior of unhandled rejections and exceptions, so
       * now there's no way of testing these kind of scenarios. We're skipping
       * this until the issue below is solved:
       *
       * ISSUE: https://github.com/facebook/jest/issues/5620
       */
      describe.skip("and the promise is rejected", () => {
        it("does NOT move to the next step", async () => {
          const beforeSpy = jest.fn(() => Promise.reject(new Error("Fail!")));
          const steps: TourStep[] = [
            BASE_STEP,
            { ...BASE_STEP, before: beforeSpy },
          ];
          const { getByText, queryByText } = render(<TestScreen steps={steps} />);

          await waitFor(() => getByText("Start"));

          fireEvent.press(getByText("Start"));

          await waitFor(() => {
            jestExpect(beforeSpy).not.toBeCalled();
            getByText("Step 1");
          });

          fireEvent.press(getByText("Next"));

          await waitFor(() => {
            jestExpect(beforeSpy).toBeCalledTimes(1);
            expect(queryByText("Step 2")).toBeNull();
          });
        });
      });
    });
  });
});
