import { fireEvent, render, RenderAPI } from "@testing-library/react-native";
import React from "react";
import { LayoutRectangle } from "react-native";

import { Position, TourStep } from "../src";
import { TourOverlay } from "../src/lib/tour-overlay/TourOverlay.component";

import { BASE_STEP } from "./spotlight.create.component";

jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper");

const changeSpotCallback = jest.fn(() => undefined);
const goToCallback = jest.fn(() => undefined);
const nextCallback = jest.fn(() => undefined);

const previousCallback = jest.fn(() => undefined);
const startCallback = jest.fn(() => undefined);
const stopCallback = jest.fn(() => undefined);

const renderTourComponent = (): RenderAPI => {
  const colorOverlay: string = "blue";
  const opacityOverlay: number = 0.5;
  const currentSpot: number = 0;
  const x: number = 0;
  const y: number = 0;
  const width: number = 100;
  const height: number = 200;
  const spotItem: LayoutRectangle = { x, y, width, height };
  const spotStep: TourStep = BASE_STEP;
  const secondSpotStep: TourStep = { ...BASE_STEP, position: Position.TOP };
  const spotSteps: TourStep[] = [spotStep, secondSpotStep];
  const tour = {
    changeSpot: changeSpotCallback,
    current: currentSpot,
    goTo: goToCallback,
    next: nextCallback,
    previous: previousCallback,
    spot: spotItem,
    start: startCallback,
    steps: spotSteps,
    stop: stopCallback
  };

  return render(<TourOverlay color={colorOverlay} opacity={opacityOverlay} tour={tour} />);
};

describe("Tour Overlay component", () => {
  describe("the spot doesn't exist", () => {
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

  describe("when rendering the tour component and firing the next/prev tour steps", () => {
    it("doesn't call any callback", async () => {
      const { getByLabelText } = renderTourComponent();
      expect(getByLabelText("Container fake component")).toBeTruthy();
      expect(getByLabelText("Container fake component")).toBeDefined();
      expect(changeSpotCallback).toBeCalledTimes(0);
      expect(goToCallback).toBeCalledTimes(0);
      expect(nextCallback).toBeCalledTimes(0);
      expect(previousCallback).toBeCalledTimes(0);
      expect(startCallback).toBeCalledTimes(0);
      expect(stopCallback).toBeCalledTimes(0);
    });

    it("goes to the first spot and call once the next action button", async () => {
      const { getByLabelText } = renderTourComponent();
      fireEvent.press(getByLabelText("Next spot button"));

      expect(nextCallback).toBeCalledTimes(1);
      expect(nextCallback).toBeCalledWith();
      expect(previousCallback).toBeCalledTimes(0);
    });

    it("goes the first spot, return to the start position and call once the previous action button", async () => {
      const { getByLabelText } = renderTourComponent();
      fireEvent.press(getByLabelText("Next spot button"));
      fireEvent.press(getByLabelText("Previous spot button"));
      expect(nextCallback).toBeCalledTimes(1);
      expect(previousCallback).toBeCalledWith();
      expect(previousCallback).toBeCalledTimes(1);
    });
  });
});
