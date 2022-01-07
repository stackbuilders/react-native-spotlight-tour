import { fireEvent, render, waitFor } from "@testing-library/react-native";
import * as React from "react";

import { SpotlightTourCtx } from "../../../src/lib/SpotlightTour.context";
import { TourOverlay } from "../../../src/lib/tour-overlay/TourOverlay.component";
import { BASE_STEP } from "../../helpers/TestTour";

const changeSpot = jest.fn(() => undefined);
const goTo = jest.fn(() => undefined);
const next = jest.fn(() => undefined);
const previous = jest.fn(() => undefined);
const start = jest.fn(() => undefined);
const stop = jest.fn(() => undefined);

const BASE_TOUR: SpotlightTourCtx = {
  changeSpot,
  current: 0,
  goTo,
  next,
  previous,
  spot: { x: 0, y: 0, width: 100, height: 200 },
  start,
  steps: Array(2).fill(BASE_STEP),
  stop
};

describe("Lib.TourOverlay.TourOverlayComponent", () => {
  describe("when the spot is NOT present", () => {
    it("does not render anything", () => {
      const tour: SpotlightTourCtx = {
        ...BASE_TOUR,
        spot: undefined
      };
      const { toJSON } = render(<TourOverlay tour={tour} />);

      expect(toJSON()).toEqual(null);
    });
  });

  describe("when the current index is NOT present", () => {
    it("does not render anything", () => {
      const tour: SpotlightTourCtx = {
        ...BASE_TOUR,
        current: undefined
      };
      const { toJSON } = render(<TourOverlay tour={tour} />);

      expect(toJSON()).toEqual(null);
    });
  });

  describe("when the spot and the current index are present", () => {
    describe("and the spot is in the first step", () => {
      it("does NOT call any callback", async () => {
        const { getByText } = render(<TourOverlay tour={BASE_TOUR} />);

        await waitFor(() => getByText("Step 1"));

        expect(changeSpot).not.toBeCalled();
        expect(goTo).not.toBeCalled();
        expect(next).not.toBeCalled();
        expect(previous).not.toBeCalled();
        expect(start).not.toBeCalled();
        expect(stop).not.toBeCalled();
      });
    });

    describe("and the next step is triggered", () => {
      it("calls the next callback once", async () => {
        const { getByText } = render(<TourOverlay tour={BASE_TOUR} />);

        await waitFor(() => getByText("Step 1"));

        fireEvent.press(getByText("Next"));

        await waitFor(() => {
          expect(next).toBeCalledTimes(1);
          expect(previous).not.toBeCalled();
        });
      });
    });
  });

  describe("and previous step is triggered", () => {
    it("calls the previous callback once", async () => {
      const { getByText } = render(<TourOverlay tour={BASE_TOUR} />);

      await waitFor(() => getByText("Step 1"));

      fireEvent.press(getByText("Next"));

      await waitFor(() => {
        expect(next).toBeCalledTimes(1);
        expect(previous).not.toBeCalled();
      });

      fireEvent.press(getByText("Previous"));

      await waitFor(() => {
        expect(next).toBeCalledTimes(1);
        expect(previous).toBeCalledTimes(1);
      });
    });
  });
});
