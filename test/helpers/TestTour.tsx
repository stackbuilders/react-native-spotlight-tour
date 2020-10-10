import * as React from "react";
import { Button, Text, View } from "react-native";

import { Align, AttachStep, Position, SpotlightTourProvider, TourStep, useSpotlightTour } from "../../src";

export const BASE_STEP: TourStep = {
  alignTo: Align.SCREEN,
  position: Position.BOTTOM,
  render: ({ next, previous }) => (
    <View accessibilityLabel="Container fake component" >
      <Text>Hello, world!</Text>
      <Button accessibilityLabel="Next spot button" title="Next spot" onPress={next} />
      <Button accessibilityLabel="Previous spot button" title="Previous spot" onPress={previous} />
    </View>
  )
};

const TestComponent: React.FC = () => {
  const tourContext = useSpotlightTour();

  const fakeAction = () => undefined;

  return (
    <View>
      <AttachStep index={0}>
        <View>Hello, world!</View>
      </AttachStep>
      <AttachStep index={1}>
        <Button onPress={fakeAction} title="Test button" />
      </AttachStep>
      <Button
        accessibilityLabel="Start tour button"
        title="start tour"
        onPress={tourContext.start}
      />
      <Button
        accessibilityLabel="Stop tour button"
        title="stop tour"
        onPress={tourContext.stop}
      />
    </View>
  );
};

export const TestScreen: React.FC = () => {
  const spotStep = BASE_STEP;
  const secondSpotStep = { ...BASE_STEP, position: Position.TOP };
  const spotSteps = [spotStep, secondSpotStep];

  return (
    <SpotlightTourProvider steps={spotSteps}>
      <TestComponent />
    </SpotlightTourProvider>
  );
};
