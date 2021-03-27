import dedent from "dedent";
import React, { useRef, useState } from "react";
import { Animated, Button, SafeAreaView, ScrollView, View } from "react-native";
import {
  Align,
  AttachStep,
  Position,
  SpotlightTourProvider,
  TourStep,
  useSpotlightTour
} from "react-native-spotlight-tour";

import {
  BoldText,
  ButtonsGroupView,
  DescriptionText,
  SectionContainerView,
  SpotDescriptionView,
  TitleText
} from "./App.styles";

const App: React.FC = () => {
  const gapValue = useRef(new Animated.Value(0));

  const tourSteps: TourStep[] = [{
    alignTo: Align.SCREEN,
    position: Position.BOTTOM,
    render: ({ next }) => (
      <SpotDescriptionView>
        <DescriptionText>
          <BoldText>{"Tour: Intro section\n"}</BoldText>
          {"This is the first step of tour example.\n"}
          {"If you want to go to the next step, please press "}<BoldText>{"Next.\n"}</BoldText>
        </DescriptionText>
        <ButtonsGroupView>
          <Button title="Next" onPress={next} />
        </ButtonsGroupView>
      </SpotDescriptionView>
    )
  }, {
    alignTo: Align.SCREEN,
    position: Position.BOTTOM,
    render: () => {
      // You can also use the hook instead of the props here!
      const { previous, next } = useSpotlightTour();

      return (
        <SpotDescriptionView>
          <DescriptionText>
            <BoldText>{"Tour: Documentation section\n"}</BoldText>
            {"This is the second step of tour example.\n"}
            {"If you want to go to the next step, please press "}<BoldText>{"Next.\n"}</BoldText>
            {"If you want to go to the previous step, press "}<BoldText>{"Previous.\n"}</BoldText>
          </DescriptionText>

          <ButtonsGroupView>
            <Button title="Previous" onPress={previous} />
            <Button title="Next" onPress={next} />
          </ButtonsGroupView>
        </SpotDescriptionView>
      );
    }
  }, {
    alignTo: Align.SCREEN,
    before: () => {
      Animated.spring(gapValue.current, {
        mass: 0.5,
        toValue: 275,
        useNativeDriver: false
      })
      .start();
    },
    position: Position.TOP,
    render: ({ previous, stop }) => (
      <SpotDescriptionView>
        <DescriptionText>
          <BoldText>{"Tour: Try it!\n"}</BoldText>
          {dedent`
            This is the third step of the tour example.
            You can move your view or make transitions before an step kicks off!\n
          `}
          {"If you want to go to the previous step, press "}<BoldText>{"Previous.\n"}</BoldText>
          {"If you want to finish the tour, press "}<BoldText>{"Finish.\n"}</BoldText>
        </DescriptionText>

        <ButtonsGroupView>
          <Button title="Previous" onPress={previous} />
          <Button title="Finish" onPress={stop} />
        </ButtonsGroupView>
      </SpotDescriptionView>
    )
  }];

  return (
    <SafeAreaView>
        <ScrollView>

          <SpotlightTourProvider
            steps={tourSteps}
            overlayColor={"gray"}
            overlayOpacity={0.36}
          >
            {({ start }) => (
              <View>
                  <Button title="Start" onPress={start} />

                  <SectionContainerView>
                    <AttachStep index={0}>
                      <TitleText>{"Introduction"}</TitleText>
                    </AttachStep>
                    <DescriptionText>
                      {dedent`
                        This is an example using the spotlight-tour library. \
                        Press the Start button to see it in action.
                      `}
                    </DescriptionText>
                  </SectionContainerView>

                  <SectionContainerView>
                    <AttachStep index={1}>
                      <TitleText>{"Documentation"}</TitleText>
                    </AttachStep>
                    <DescriptionText>
                      {"Please, read the documentation before install it."}
                    </DescriptionText>
                  </SectionContainerView>

                  <Animated.View style={{ marginTop: gapValue.current }}>
                    <SectionContainerView>
                      <AttachStep index={2}>
                        <TitleText>{"Try it!"}</TitleText>
                      </AttachStep>
                      <DescriptionText>
                        {"Remember that all feedback are welcome."}
                      </DescriptionText>
                    </SectionContainerView>
                  </Animated.View>
                </View>
            )}
          </SpotlightTourProvider>
        </ScrollView>
      </SafeAreaView>
  );
};

export default App;
