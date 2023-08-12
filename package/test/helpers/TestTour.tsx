import React from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";

import { AttachStep, SpotlightTourProvider, TourStep, useSpotlightTour } from "../../src";

interface TestScreenProps {
  steps?: TourStep[];
}

export const BASE_STEP: TourStep = {
  floatingProps:{
    placement: "bottom",
  },
  render: ({ current, next, previous, stop }) => (
    <View>
      <Text>{`Step ${current + 1}`}</Text>

      <TouchableOpacity onPress={next}>
        <Text>{"Next"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={previous}>
        <Text>{"Previous"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={stop}>
        <Text>{"Stop"}</Text>
      </TouchableOpacity>
    </View>
  ),
};

const TestComponent: React.FC = () => {
  const tourContext = useSpotlightTour();

  return (
    <View>
      <AttachStep index={0}>
        <View>{"Hello, world!"}</View>
      </AttachStep>

      <AttachStep index={1}>
        <Button onPress={jest.fn()} title="Test button" />
      </AttachStep>

      <TouchableOpacity onPress={tourContext.start}>
        <Text>{"Start"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const defaultSteps = [
  BASE_STEP,
  { ...BASE_STEP },
];

export const TestScreen: React.FC<TestScreenProps> = ({ steps }) => {
  return (
    <SpotlightTourProvider steps={steps ?? defaultSteps}>
      <TestComponent />
    </SpotlightTourProvider>
  );
};
