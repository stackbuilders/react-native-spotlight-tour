import { cleanup, fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Button, LayoutRectangle, Text, View } from "react-native";

import { Align, Position, RenderProps, SpotlightTour, TourStep } from "../../SpotlightTour.context";
import { TourOverlay } from "../TourOverlay.component";

jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper");

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

const customTourComponent = (props: RenderProps): React.ReactNode => {
  expect(props.current).toEqual(0);
  expect(props.isFirst).toBeTruthy();
  expect(props.isLast).toBeFalsy();

  return (
    <View accessibilityLabel="Container fake component" style={{
      alignItems: "center",
      flex: 1,
      justifyContent: "center"
    }}>
      <Text>Hello, world!</Text>
      <Button accessibilityLabel="Next spot button" title="next spot" onPress={props.next} />
      <Button accessibilityLabel="Previous spot button" title="previous spot" onPress={props.previous} />
    </View>
  );
};

const getComponentRender = (
  colorOverlay: string,
  opacityOverlay: number,
  { changeSpot, current, goTo, next, previous, start, steps, stop, spot }: SpotlightTour
  ) => {
  const tour: SpotlightTour = {
    changeSpot,
    current,
    goTo,
    next,
    previous,
    spot,
    start,
    steps,
    stop
  };

  return render(<TourOverlay color={colorOverlay} opacity={opacityOverlay} tour={tour} />);
};

const getSpotLayoutRectangle = ({ x, y, width, height }: LayoutRectangle): LayoutRectangle => {
  return { x, y, width, height };
};

const getSpotStep = (position: Position): TourStep => {
  return {
    alignTo: Align.SCREEN,
    position,
    render: customTourComponent
  };
};

const changeSpotCallback = jest.fn(() => undefined);
const goToCallback = jest.fn(() => undefined);
const nextCallback = jest.fn(() => undefined);

const previousCallback = jest.fn(() => undefined);
const startCallback = jest.fn(() => undefined);
const stopCallback = jest.fn(() => undefined);

const renderTourComponent = () => {
  const colorOverlay: string = "blue";
  const opacityOverlay: number = 0.5;
  const currentSpot: number = 0;
  const x: number = 0;
  const y: number = 0;
  const width: number = 100;
  const height: number = 200;
  const spotItem: LayoutRectangle = getSpotLayoutRectangle({ x, y, width, height });
  const spotStep: TourStep = getSpotStep(Position.BOTTOM);
  const secondSpotStep: TourStep = getSpotStep(Position.TOP);
  const spotSteps: TourStep[] = [spotStep, secondSpotStep];
  const renderer = getComponentRender(
    colorOverlay,
    opacityOverlay,
    {
      changeSpot: changeSpotCallback,
      current: currentSpot,
      goTo: goToCallback,
      next: nextCallback,
      previous: previousCallback,
      spot: spotItem,
      start: startCallback,
      steps: spotSteps,
      stop: stopCallback
    });

  return renderer;
};

describe("Tour Overlay component", () => {
  it("render null because the spot doesn't exist)", () => {
    const colorOverlay: string = "blue";
    const opacityOverlay: number = 0.5;
    const currentSpot: number = 0;
    const spotSteps: TourStep[] = [];
    const { toJSON } = getComponentRender(colorOverlay, opacityOverlay,
      {
        changeSpot: () => undefined,
        current: currentSpot,
        goTo: () => undefined,
        next: () => undefined,
        previous: () => undefined,
        spot: undefined,
        start: () => undefined,
        steps: spotSteps,
        stop: () => undefined
      });

    expect(toJSON()).toEqual(null);
  });

  describe("when render the tour component and fire next/prev tour steps", () => {
    it("doesn't call any callback", async () => {
      const { getByLabelText } = await renderTourComponent();
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
      const { getByLabelText } = await renderTourComponent();
      fireEvent.press(getByLabelText("Next spot button"));

      expect(nextCallback).toBeCalledTimes(1);
      expect(nextCallback).toBeCalledWith();
      expect(previousCallback).toBeCalledTimes(0);
    });

    it("goes the first spot, return to the start position and call once the previous action button", async () => {
      const { getByLabelText } = await renderTourComponent();
      fireEvent.press(getByLabelText("Next spot button"));
      fireEvent.press(getByLabelText("Previous spot button"));
      expect(nextCallback).toBeCalledTimes(1);
      expect(previousCallback).toBeCalledWith();
      expect(previousCallback).toBeCalledTimes(1);
    });
  });
});
