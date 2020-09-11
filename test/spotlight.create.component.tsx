import React from "react";
import { Button, Omit, Text, View } from "react-native";

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

const ComponentElement = React.forwardRef(
  (): React.ReactElement => {
    const parentRef: Omit<
      SpotlightTour,
      "changeSpot" | "spot" | "steps"
    > = useSpotlightTour();

    const fakeAction = () => undefined;

    return (
      <View
        style={{
          alignItems: "center",
          flex: 1,
          justifyContent: "center"
        }}
      >
        <AttachStep index={1}>
          <View>Hello, world!</View>
        </AttachStep>
        <AttachStep index={2}>
          <Button
            onPress={fakeAction}
            title="Test button"
          />
        </AttachStep>
        <Button
          accessibilityLabel="Start tour button"
          title="start tour"
          onPress={parentRef.start}
        />
        <Button
          accessibilityLabel="Stop tour button"
          title="stop tour"
          onPress={parentRef.stop}
        />
      </View>
    );
  }
);

const getAttachedComponent = () => {
  return (
    <AttachStep index={0}>
      <ComponentElement />
    </AttachStep>
  );
};

const customTourComponent = (props: RenderProps): React.ReactNode => {
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
    render: customTourComponent
  };
};

export const getComponentOverTour = () => {
  const spotStep: TourStep = getSpotStep(Position.BOTTOM, Align.SCREEN);
  const secondSpotStep: TourStep = getSpotStep(Position.BOTTOM, Align.SCREEN);
  const thirdSpotStep: TourStep = getSpotStep(Position.TOP, Align.SCREEN);
  const spotSteps: TourStep[] = [spotStep, secondSpotStep, thirdSpotStep];

  return (
    <SpotlightTourProvider steps={spotSteps}>
      {getAttachedComponent()}
    </SpotlightTourProvider>
  );
};
