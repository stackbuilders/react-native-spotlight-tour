import { expect } from "@assertive-ts/core";
import { fireEvent, render, userEvent, waitFor } from "@testing-library/react-native";
import React from "react";
import { CircleProps } from "react-native-svg";
import { mockNative, restoreNativeMocks } from "react-native-testing-mocks";
import Sinon from "sinon";
import { afterEach, describe, it, suite } from "vitest";

import { TourStep } from "../../src/lib/SpotlightTour.context";
import { BASE_STEP, TestScreen } from "../helpers/TestTour";
import { checkValidIntersection, findPropsOnTestInstance } from "../helpers/helper";
import { buttonMockMeasureData, viewMockMeasureData } from "../helpers/measures";

suite("[Integration] main.test.tsx", () => {
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

        await userEvent.press(getByText("Start"));

        await waitFor(() => getByTestId("Overlay View"));
      });
    });
  });

  describe("when the tour is running", () => {
    afterEach(restoreNativeMocks);

    describe("and the tour moves to the first spot", () => {
      it("wraps the component with the SVG circle", async () => {
        mockNative("View", {
          measureInWindow: callback => {
            const { height, width, x, y } = viewMockMeasureData;
            callback(x, y, width, height);
          },
        });

        const { findByText, findByTestId } = render(<TestScreen />);

        const startButton = await findByText("Start");

        await userEvent.press(startButton);

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
        mockNative("View", {
          measureInWindow: callback => {
            const { height, width, x, y } = viewMockMeasureData;
            callback(x, y, width, height);
          },
        });

        const { getByText, getByTestId } = render(<TestScreen />);

        await waitFor(() => getByText("Start"));

        await userEvent.press(getByText("Start"));

        await waitFor(() => getByText("Step 1"));

        mockNative("View", {
          measureInWindow: callback => {
            const { height, width, x, y } = buttonMockMeasureData;
            callback(x, y, width, height);
          },
        });

        await userEvent.press(getByText("Next"));

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

      await userEvent.press(getByText("Start"));

      await waitFor(() => getByText("Step 1"));

      await userEvent.press(getByText("Stop"));

      expect(queryByTestId("Overlay View")).toBeNull();
    });
  });

  describe("and the step has a before hook", () => {
    describe("and the hook does NOT return a promise", () => {
      it("runs the hook before going to the next step", async () => {
        const spy = Sinon.spy(() => undefined);
        const steps: TourStep[] = [
          BASE_STEP,
          { ...BASE_STEP, before: spy },
        ];
        const { getByText } = render(<TestScreen steps={steps} />);

        await waitFor(() => getByText("Start"));

        await userEvent.press(getByText("Start"));

        await waitFor(() => {
          expect(spy).toNeverBeCalled();
          getByText("Step 1");
        });

        await userEvent.press(getByText("Next"));

        await waitFor(() => {
          expect(spy).toBeCalledOnce();
          getByText("Step 2");
        });
      });
    });

    describe("and the hook returns a promise", () => {
      describe("and the promise is resolved", () => {
        it("runs the hook before going to the next step", async () => {
          const spy = Sinon.spy(() => Promise.resolve());
          const steps: TourStep[] = [
            BASE_STEP,
            { ...BASE_STEP, before: spy },
          ];
          const { getByText } = render(<TestScreen steps={steps} />);

          await waitFor(() => getByText("Start"));

          await userEvent.press(getByText("Start"));

          await waitFor(() => {
            expect(spy).toNeverBeCalled();
            getByText("Step 1");
          });

          await userEvent.press(getByText("Next"));

          await waitFor(() => {
            expect(spy).toBeCalledOnce();
            getByText("Step 2");
          });
        });
      });

      describe("and the promise is rejected", () => {
        it("does NOT move to the next step", async () => {
          const error = new Error("Fail!");
          const promiseRejected = new Promise<void>((resolve, reject) => {
            const handler = (reason: unknown): void => {
              process.off("unhandledRejection", handler);

              try {
                expect(reason).toBeEqual(error);
                resolve();
              } catch (err) {
                reject(err);
              }
            };

            process.on("unhandledRejection", handler);
          });
          const spy = Sinon.spy(() => Promise.reject(error));
          const steps: TourStep[] = [
            BASE_STEP,
            { ...BASE_STEP, before: spy },
          ];
          const { getByText, queryByText } = render(<TestScreen steps={steps} />);

          await waitFor(() => getByText("Start"));

          await userEvent.press(getByText("Start"));

          await waitFor(() => {
            expect(spy).toNeverBeCalled();
            getByText("Step 1");
          });

          await userEvent.press(getByText("Next"));

          await expect(promiseRejected).toBeResolved();

          expect(spy).toBeCalledOnce();
          expect(queryByText("Step 2")).toBeNull();
        });
      });
    });
  });
});
