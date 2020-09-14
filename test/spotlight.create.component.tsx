import React from "react";
import { Button, Text, View } from "react-native";

import {
  Align,
  AttachStep,
  Position,
  RenderProps,
  SpotlightTourProvider,
  TourStep
} from "../src";
import {
  SpotlightTour,
  useSpotlightTour
} from "../src/lib/SpotlightTour.context";

const TestComponent = React.forwardRef(
  (): React.ReactElement => {
    const libraryContext: SpotlightTour = useSpotlightTour();

    const fakeAction = () => undefined;

    return (
      <View
        style={{
          alignItems: "center",
          flex: 1,
          justifyContent: "center"
        }}
      >
        <AttachStep index={0}>
          <View>Hello, world!</View>
        </AttachStep>
        <AttachStep index={1}>
          <Button
            onPress={fakeAction}
            title="Test button"
          />
        </AttachStep>
        <Button
          accessibilityLabel="Start tour button"
          title="start tour"
          onPress={libraryContext.start}
        />
        <Button
          accessibilityLabel="Stop tour button"
          title="stop tour"
          onPress={libraryContext.stop}
        />
      </View>
    );
  }
);

const customTipTourComponent = (props: RenderProps): React.ReactNode => {
  return (
    <View
      style={{
        alignItems: "center",
        flex: 1,
        justifyContent: "center"
      }}
    >
      <Text>Tour description!</Text>
      <Button
        accessibilityLabel="Next spot button"
        title="next spot"
        onPress={props.next}
      />
      <Button
        accessibilityLabel="Previous spot button"
        title="previous spot"
        onPress={props.previous}
      />
    </View>
  );
};

const getSpotStep = (position: Position, alignTo: Align): TourStep => {
  return {
    alignTo,
    position,
    render: customTipTourComponent
  };
};

export const getComponentOverTour = () => {
  const spotStep: TourStep = getSpotStep(Position.BOTTOM, Align.SCREEN);
  const secondSpotStep: TourStep = getSpotStep(Position.TOP, Align.SCREEN);
  const spotSteps: TourStep[] = [spotStep, secondSpotStep];

  return (
    <SpotlightTourProvider steps={spotSteps}>
      {<TestComponent />}
    </SpotlightTourProvider>
  );
};
