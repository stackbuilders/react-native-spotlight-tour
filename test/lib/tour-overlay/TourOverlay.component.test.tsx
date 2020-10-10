import { fireEvent, render, RenderAPI } from "@testing-library/react-native";
import * as React from "react";

import { Position, TourStep } from "../../../src";
import { TourOverlay } from "../../../src/lib/tour-overlay/TourOverlay.component";
import { BASE_STEP } from "../../helpers/TestTour";

const changeSpot = jest.fn(() => undefined);
const goTo = jest.fn(() => undefined);
const next = jest.fn(() => undefined);

const previous = jest.fn(() => undefined);
const start = jest.fn(() => undefined);
const stop = jest.fn(() => undefined);

const renderTourComponent = (): RenderAPI => {
  const tour = {
    changeSpot,
    current: 0,
    goTo,
    next,
    previous,
    spot: { x: 0, y: 0, width: 100, height: 200 },
    start,
    steps: [BASE_STEP, { ...BASE_STEP, position: Position.TOP }],
    stop
  };

  return render(<TourOverlay tour={tour} />);
};

describe("Lib.TourOverlay.TourOverlayComponent", () => {
  describe("when the spot does NOT exist", () => {
    it("renders null", () => {
      const colorOverlay: string = "blue";
      const opacityOverlay: number = 0.5;
      const currentSpot: number = 0;
      const spotSteps: TourStep[] = [];
      const tour = {
        changeSpot: () => undefined,
        current: currentSpot,
        goTo: () => undefined,
        next: () => undefined,
        previous: () => undefined,
        spot: undefined,
        start: () => undefined,
        steps: spotSteps,
        stop: () => undefined
      };
      const { toJSON } = render(<TourOverlay color={colorOverlay} opacity={opacityOverlay} tour={tour} />);

      expect(toJSON()).toEqual(null);
    });
  });

  describe("when the spot exists", () => {
    describe("and the stays on the first step", () => {
      it("doesn't call any callback", () => {
        const { getByLabelText } = renderTourComponent();
        expect(getByLabelText("Container fake component")).toBeTruthy();
        expect(getByLabelText("Container fake component")).toBeDefined();
        expect(changeSpot).toBeCalledTimes(0);
        expect(goTo).toBeCalledTimes(0);
        expect(next).toBeCalledTimes(0);
        expect(previous).toBeCalledTimes(0);
        expect(start).toBeCalledTimes(0);
        expect(stop).toBeCalledTimes(0);
      });
    });

    describe("and the next step is triggered", () => {
      it("renders the first spot and calls the next action once", () => {
        const { getByLabelText } = renderTourComponent();
        fireEvent.press(getByLabelText("Next spot button"));

        expect(next).toBeCalledTimes(1);
        expect(next).toBeCalledWith();
        expect(previous).toBeCalledTimes(0);
      });
    });
  });

  describe("and previous step is triggered", () => {
    it("renders the second spot and calls the previous action once", () => {
      const { getByLabelText } = renderTourComponent();
      fireEvent.press(getByLabelText("Next spot button"));
      fireEvent.press(getByLabelText("Previous spot button"));
      expect(next).toBeCalledTimes(1);
      expect(previous).toBeCalledWith();
      expect(previous).toBeCalledTimes(1);
    });
  });
});
