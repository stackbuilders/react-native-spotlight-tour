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
    <View testID="container.fake.component" style={{
      alignItems: "center",
      flex: 1,
      justifyContent: "center"
    }}>
      <Text>Hello, world!</Text>
      <Button testID="spot.button.next" title="next spot" onPress={props.next} />
      <Button testID="spot.button.previous" title="previous spot" onPress={props.previous} />
    </View>
  );
};

const getComponentRender = (
  colorOverlay: string,
  opacityOverlay: number,
  { changeSpot, current, goTo, next, previous, start, steps, stop, spot }: {[key: string]: any}
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

describe("Tour Overlay component", () => {
  it("should render null (without spot)", () => {
    const colorOverlay = "blue";
    const opacityOverlay = 0.5;
    const currentSpot = 0;
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

  it("should render the tour component and fire next/prev tour steps", () => {
    const colorOverlay = "blue";
    const opacityOverlay = 0.5;
    const currentSpot = 0;
    const x = 0;
    const y = 0;
    const width = 100;
    const height = 200;
    const spotItem: LayoutRectangle = getSpotLayoutRectangle({ x, y, width, height });
    const spotStep: TourStep = getSpotStep(Position.BOTTOM);
    const secondSpotStep: TourStep = getSpotStep(Position.TOP);
    const spotSteps: TourStep[] = [spotStep, secondSpotStep];
    const changeSpotCallback = jest.fn(() => undefined);
    const goToCallback = jest.fn(() => undefined);
    const nextCallback = jest.fn(() => undefined);

    const previousCallback = jest.fn(() => undefined);
    const startCallback = jest.fn(() => undefined);
    const stopCallback = jest.fn(() => undefined);
    const { getByTestId } = getComponentRender(
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

    const childrenSpot = getByTestId("container.fake.component");
    const previousSpotButton = getByTestId("spot.button.previous");
    const nextSpotButton = getByTestId("spot.button.next");
    expect(childrenSpot).toBeTruthy();
    expect(childrenSpot).toBeDefined();
    expect(changeSpotCallback).toBeCalledTimes(0);
    expect(goToCallback).toBeCalledTimes(0);
    expect(nextCallback).toBeCalledTimes(0);
    expect(previousCallback).toBeCalledTimes(0);
    expect(startCallback).toBeCalledTimes(0);
    expect(stopCallback).toBeCalledTimes(0);

    fireEvent.press(nextSpotButton);

    expect(nextCallback).toBeCalledTimes(1);
    expect(nextCallback).toBeCalledWith();
    expect(previousCallback).toBeCalledTimes(0);

    fireEvent.press(previousSpotButton);
    expect(nextCallback).toBeCalledTimes(1);
    expect(previousCallback).toBeCalledWith();
    expect(previousCallback).toBeCalledTimes(1);

  });
});
