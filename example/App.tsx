/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button, StyleProp, TextStyle,
} from "react-native";

import {
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";

import {
  Align,
  AttachStep,
  Position,
  SpotlightTourProvider,
  TourStep,
  useSpotlightTour,
} from "react-native-spotlight-tour";

import {
  DescriptionText,
  BoldText,
  SectionContainerView,
  SpotDescriptionView,
  TitleText,
  ButtonsGroupView
} from "./App.styles";

const App=() => {
  const getTourSteps: TourStep[]=
    [
      {
        alignTo: Align.SCREEN,
        position: Position.BOTTOM,
        render: (props) => {
          const {next}=useSpotlightTour();
          return (
            <SpotDescriptionView>
              <DescriptionText>
                <BoldText>Tour: First StepFirst {"\n"}</BoldText>
                This is the first step of tour example.
                If you want to go to the next step, please press <BoldText>Next</BoldText>
              </DescriptionText>
              <ButtonsGroupView>
                <Button title="Next" onPress={next}/>
              </ButtonsGroupView>
            </SpotDescriptionView>
          );
        },
      },
      {
        alignTo: Align.SCREEN,
        position: Position.BOTTOM,
        render: (props) => {
          const {previous, stop}=useSpotlightTour();
          return (
            <SpotDescriptionView>
              <DescriptionText>
                <BoldText>Tour: Second Step {"\n"}</BoldText>
                This is the second step of tour example. {"\n"}
                If you want to go to the previous step, press <BoldText>Previous. {"\n"}</BoldText>
                If you want to finish the tour, press <BoldText>Finish. {"\n"}</BoldText>
              </DescriptionText>
              <ButtonsGroupView>
                <Button title="Previous" onPress={previous}/>
                <Button title="Finish" onPress={stop}/>
              </ButtonsGroupView>
            </SpotDescriptionView>
          );
        },
      },
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
                  <Button title="Start" onPress={start}/>

                  <SectionContainerView>
                    <AttachStep index={0}>
                      <TitleText>Introduction</TitleText>
                    </AttachStep>
                    <DescriptionText>
                      Edit <BoldText>App.tsx</BoldText> to change
                      this screen and then come back to see your edits.
                    </DescriptionText>
                  </SectionContainerView>
                  <SectionContainerView>
                    <AttachStep index={1}>
                      <TitleText>See Your Changes</TitleText>
                    </AttachStep>
                    <DescriptionText>
                      <ReloadInstructions/>
                    </DescriptionText>
                  </SectionContainerView>
                  <SectionContainerView>
                    <TitleText>Debug</TitleText>
                    <DescriptionText>
                      <DebugInstructions/>
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
