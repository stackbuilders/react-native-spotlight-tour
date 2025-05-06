import { Button, Text, TouchableOpacity, View } from "react-native";
import Sinon from "sinon";

import { AttachStep, SpotlightTourProvider, type TourStep, useSpotlightTour } from "../../src/main";

import type React from "react";

interface TestScreenProps {
  steps?: TourStep[];
}

export const BASE_STEP: TourStep = {
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
        <Button onPress={Sinon.fake} title="Test button" />
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
    <SpotlightTourProvider nativeDriver={false} steps={steps ?? defaultSteps}>
      <TestComponent />
    </SpotlightTourProvider>
  );
};
