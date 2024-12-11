import dedent from "dedent";
import React, { ReactElement, useCallback, useMemo, useRef } from "react";
import { Alert, Animated, Button, Dimensions, SafeAreaView, Text } from "react-native";
import {
  AttachStep,
  PauseParams,
  SpotlightTourProvider,
  StopParams,
  TourBox,
  TourStep,
} from "react-native-spotlight-tour";

import {
  BoldText,
  ButtonsGroupView,
  DescriptionText,
  SectionContainerView,
  SpotDescriptionView,
  TitleText,
} from "./App.styles";
import { DocsTooltip } from "./DocsTooltip";

export function App(): ReactElement {
  const gap = useRef(new Animated.Value(0)).current;

  const showSummary = useCallback(({ index, isLast }: StopParams) => {
    Alert.alert(
      "Tour Finished",
      dedent`
        Step index: ${String(index)}
        Is last step: ${String(isLast)}
      `,
    );
  }, []);

  const alertPause = useCallback(({ index }: PauseParams) => {
    Alert.alert(
      "Pause Example",
      dedent`
      Paused on step: ${String(index)} 
    `,
    );
  }, []);

  const tourSteps = useMemo((): TourStep[] => [{
    render: ({ next, pause }) => (
      <SpotDescriptionView>
        <DescriptionText>
          <BoldText>{"Tour: Intro section\n"}</BoldText>
          {dedent`
            This is the first step of tour example.
            If you want to go to the next step, please press \
          `}
          <BoldText>{"Next.\n"}</BoldText>
          {dedent`
            If you want to Pause the Tour, please press \
          `}
          <BoldText>{"Pause.\n"}</BoldText>
        </DescriptionText>
        <ButtonsGroupView>
          <Button title="Pause" onPress={pause} />
          <Button title="Next" onPress={next} />
        </ButtonsGroupView>
      </SpotDescriptionView>
    ),
  }, {
    render: DocsTooltip,
  }, {
    arrow: true,
    render: props => (
      <TourBox
        title="Tour: Customization"
        backText="Previous"
        nextText="Next"
        {...props}
      >
        <Text>
          {dedent`
            This is the third step of tour example.
            If you want to go to the next step, please press \
          `}
          <BoldText>{"Next.\n"}</BoldText>
          {"If you want to pause the tour, press "}
          <BoldText>{"Pause.\n"}</BoldText>
          {"If you want to go to the previous step, press "}
          <BoldText>{"Previous.\n"}</BoldText>
        </Text>
      </TourBox>
    ),
  }, {
    before() {
      return new Promise<void>(resolve => {
        Animated.spring(gap, {
          bounciness: 100,
          speed: 1,
          toValue: Dimensions.get("screen").height * 0.25,
          useNativeDriver: false, // Translate animation not supported native by native driver
        })
          .start(() => resolve());
      });
    },
    render: ({ previous, stop }) => (
      <SpotDescriptionView>
        <DescriptionText>
          <BoldText>{"Tour: Try it!\n"}</BoldText>
          {dedent`
            This is the final step of the tour example.
            You can move your view or make transitions before an step kicks off!
            If you want to go to the previous step, press \
          `}
          <BoldText>{"Previous.\n"}</BoldText>
          {"If you want to finish the tour, press "}
          <BoldText>{"Finish.\n"}</BoldText>
        </DescriptionText>

        <ButtonsGroupView>
          <Button title="Previous" onPress={previous} />
          <Button title="Finish" onPress={stop} />
        </ButtonsGroupView>
      </SpotDescriptionView>
    ),
  }], []);

  return (
    <SafeAreaView>
      <SpotlightTourProvider
        steps={tourSteps}
        overlayColor="gray"
        overlayOpacity={0.36}
        nativeDriver={true}
        onBackdropPress="continue"
        onStop={showSummary}
        onPause={alertPause}
        motion="bounce"
        shape="circle"
        arrow={{ color: "#B0C4DE" }}
      >
        {({ start, resume, lastCurrent }) => (
          <>
            <Button title="Start" onPress={start} />
            {lastCurrent !== undefined && <Button title="Resume" onPress={resume} />}

            <SectionContainerView>
              <AttachStep index={0}>
                <TitleText>{"Introduction"}</TitleText>
              </AttachStep>
              <DescriptionText>
                {dedent`
                  This is an example using react-native-spotlight-tour library. \
                  Press the Start button to see it in action.
                `}
              </DescriptionText>
            </SectionContainerView>

            <SectionContainerView>
              <AttachStep index={1}>
                <TitleText>{"Documentation"}</TitleText>
              </AttachStep>
              <DescriptionText>
                {"Please, read the documentation before installing."}
              </DescriptionText>
            </SectionContainerView>

            <SectionContainerView>
              <AttachStep index={2}>
                <TitleText>{"It is fully customizable!"}</TitleText>
              </AttachStep>
              <DescriptionText>
                {"A variety of options are available and you can create your own"}
              </DescriptionText>
            </SectionContainerView>

            <Animated.View style={{ transform: [{ translateY: gap }] }}>
              <SectionContainerView>
                <AttachStep index={3}>
                  <TitleText>{"Try it!"}</TitleText>
                </AttachStep>
                <DescriptionText>
                  {"Remember that all feedback is welcome."}
                </DescriptionText>
              </SectionContainerView>
            </Animated.View>
          </>
        )}
      </SpotlightTourProvider>
    </SafeAreaView>
  );
}
