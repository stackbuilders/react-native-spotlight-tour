/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from "react";
import { Button, SafeAreaView, ScrollView, View } from "react-native";
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

const App = () => {
  const getTourSteps: TourStep[] =
    [
      {
        alignTo: Align.SCREEN,
        position: Position.BOTTOM,
        render: () => {
          const {next} = useSpotlightTour();
          return (
            <SpotDescriptionView>
              <DescriptionText>
                <BoldText>Tour: Intro section {"\n"}</BoldText>
                This is the first step of tour example.
                If you want to go to the next step, please press <BoldText>Next</BoldText>
              </DescriptionText>
              <ButtonsGroupView>
                <Button title="Next" onPress={next} />
              </ButtonsGroupView>
            </SpotDescriptionView>
          );
        }
      },
      {
        alignTo: Align.SCREEN,
        position: Position.BOTTOM,
        render: () => {
          const {previous, stop} = useSpotlightTour();
          return (
            <SpotDescriptionView>
              <DescriptionText>
                <BoldText>Tour: Documentation section {"\n"}</BoldText>
                This is the second step of tour example. {"\n"}
                If you want to go to the previous step, press <BoldText>Previous. {"\n"}</BoldText>
                If you want to finish the tour, press <BoldText>Finish. {"\n"}</BoldText>
              </DescriptionText>
              <ButtonsGroupView>
                <Button title="Previous" onPress={previous} />
                <Button title="Finish" onPress={stop} />
              </ButtonsGroupView>
            </SpotDescriptionView>
          );
        }
      }
    ];

  return (
    <>
      <SafeAreaView>
        <ScrollView>

          <SpotlightTourProvider
            steps={getTourSteps}
            overlayColor={"gray"}
            overlayOpacity={0.36}
          >
            {({start}) => (
              <>
                <View>
                  <Button title="Start" onPress={start} />

                  <SectionContainerView>
                    <AttachStep index={0}>
                      <TitleText>Introduction</TitleText>
                    </AttachStep>
                    <DescriptionText>
                      This is an example using the spotlight-tour library.
                      Press the Start button to see it in action.
                    </DescriptionText>
                  </SectionContainerView>
                  <SectionContainerView>
                    <AttachStep index={1}>
                      <TitleText>Documentation</TitleText>
                    </AttachStep>
                    <DescriptionText>
                      Please, read the documentation before install it.
                    </DescriptionText>
                  </SectionContainerView>
                  <SectionContainerView>
                    <TitleText>Try it!</TitleText>
                    <DescriptionText>
                      Remember that all feedback are welcome.
                    </DescriptionText>
                  </SectionContainerView>
                </View>
              </>
            )}
          </SpotlightTourProvider>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;
