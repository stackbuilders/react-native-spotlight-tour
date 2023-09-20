import dedent from "@cometlib/dedent";
import React, { ReactElement, useCallback, useMemo, useRef } from "react";
import { Alert, Animated, Button, Dimensions, SafeAreaView, Text } from "react-native";
import {
  AttachStep,
  SpotlightTourProvider,
  TourBox,
  TourStep,
  flip,
  offset,
  shift,
  StopParams,
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

  const onStopTour = useCallback(({ index, isLast }: StopParams) => {
    Alert.alert(dedent`
        Step index: ${String(index)} \n
        Is last step: ${String(isLast)}
      `,
    );
  }, []);

  const tourSteps = useMemo((): TourStep[] => [{
    floatingProps: {
      middleware: [offset(0), shift(), flip()],
      placement: "right",
    },
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
    ),
  }, {
    render: DocsTooltip,
  },
  {
    render: props => (
      <TourBox
        title="Tour: Customization"
        backText="Previous"
        nextText="Next"
        {...props}
      >
        <Text>
          {"This is the third step of tour example.\n"}
          {"If you want to go to the next step, please press "}<BoldText>{"Next.\n"}</BoldText>
          {"If you want to go to the previous step, press "}<BoldText>{"Previous.\n"}</BoldText>
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
    floatingProps: {
      middleware: [offset(4), shift()],
      placement: "top",
    },
    render: ({ previous, stop }) => (
      <SpotDescriptionView>
        <DescriptionText>
          <BoldText>{"Tour: Try it!\n"}</BoldText>
          {dedent`
            This is the final step of the tour example.
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
    ),
  }], []);

  return (
    <SafeAreaView>
      <SpotlightTourProvider
        steps={tourSteps}
        overlayColor={"gray"}
        overlayOpacity={0.36}
        nativeDriver={true}
        floatingProps={{
          middleware:[offset(5), shift(), flip()],
          placement: "bottom",
        }}
        onBackdropPress="continue"
        onStop={onStopTour}
        motion="bounce"
        shape="circle"
      >
        {({ start }) => (
          <>
            <Button title="Start" onPress={start} />

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
