import "@testing-library/jest-native/extend-expect";
import { act, cleanup, fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Button, Text, View } from "react-native";

import { buttonMockMeasureData, viewMockMeasureData  } from "../setup";
import { Align, AttachStep, Position, RenderProps, TourStep } from "../src";
import { SpotlightTourProvider } from "../src";
import { useSpotlightTour } from "../src/lib/SpotlightTour.context";

import mockNativeComponent from "./mock.utils/mock.native.component";

jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper");

/*
* Previous declarations:
  Dimensions mock by default are:
  Dimensions: {
            window: {
              fontScale: 2,
              height: 1334,
              scale: 2,
              width: 750,
            },
            screen: {
              fontScale: 2,
              height: 1334,
              scale: 2,
              width: 750,
            },
          }
* */
afterEach(() => {
  cleanup();
  jest.resetAllMocks();
  jest.clearAllMocks();
});

const ComponentElement = React.forwardRef((): React.ReactElement => {
  const parentRef = useSpotlightTour();

  const fakeAction = () => undefined;

  return (
    <View testID="container.fake.component" style={{
      alignItems: "center",
      flex: 1,
      justifyContent: "center"
    }}>
      <AttachStep index={1}>
        <View testID="view.fake.component.second.item">Hello, world!</View>
      </AttachStep>
      <AttachStep index={2}>
        <Button testID="button.fake.component.third.item" onPress={fakeAction} title="Test button" />
      </AttachStep>
      <Button testID="button.tour.component.start" title="start tour" onPress={parentRef.start} />
    </View>
  );
});

const getAttachedComponent = () => {
  return (
    <AttachStep index={0}>
      <ComponentElement />
    </AttachStep>
  );
};

const customTourComponent = (props: RenderProps): React.ReactNode => {
  return (
      <View testID="container.tour.component" style={{
        alignItems: "center",
        flex: 1,
        justifyContent: "center"
      }}>
        <Text>Tour description!</Text>
        <Button testID="spot.button.next" title="next spot" onPress={props.next} />
        <Button testID="spot.button.previous" title="previous spot" onPress={props.previous} />
      </View>
    );
};

const getSpotStep = (position: Position): TourStep => {
  return {
    alignTo: Align.SCREEN,
    position,
    render: customTourComponent
  };
};

const getComponentOverTour = () => {
  const spotStep: TourStep = getSpotStep(Position.BOTTOM);
  const secondSpotStep: TourStep = getSpotStep(Position.BOTTOM);
  const thirdSpotStep: TourStep = getSpotStep(Position.TOP);
  const spotSteps: TourStep[] = [spotStep, secondSpotStep, thirdSpotStep];

  return (
    <SpotlightTourProvider steps={spotSteps} >
      {getAttachedComponent()}
    </SpotlightTourProvider>
  );
};

test("It should test the spotlight library behavior", () => {
    const instanceMethods = {
      measureInWindow: (callback: any): void => {
        const x = 10;
        const y = 100;
        const width = 50;
        const height = 150;
        callback(x, y, width, height);
      }
    };

    jest.doMock("react-native/Libraries/Components/View/View", () => {

      return mockNativeComponent("react-native/Libraries/Components/View/View", instanceMethods);

    });

  const { getByTestId } = render(getComponentOverTour());
  const startTourButton = getByTestId("button.tour.component.start");

  fireEvent.press(startTourButton);

  const nextTourButton = getByTestId("spot.button.next");
  const tourOverlayComponent = getByTestId("tour.overlay.component.tipView");

  expect(tourOverlayComponent).toHaveStyle({
    position: "absolute"
  });

  fireEvent.press(nextTourButton);

  act(() => {
    fireEvent(tourOverlayComponent, "onLayout", {
      nativeEvent: {
        layout: {
          height: viewMockMeasureData.height,
          width: viewMockMeasureData.width
        }
      }
    });
  });

  /* The next assertion is by using the next equations
   The first position that we selected was Position.BOTTOM line 74, and the align is "screen" line 67
   then:
     left will be equal to "Math.round((vwDP(100) - tipLayout.width) / 2)"
       where:
            * wwDP(100) = 750 #According with the dimensions mock
            * tipLayout.width =  200 #Acording with viewMockMeasureData.width
       so, left = Math.round(750 - 200) / 2 = 275;
     marginTop = tipMargin fixed with "2%"
     top = Math.round(cy + r)
       where:
            * cy = spot.y + (spot.height / 2) = 1 + (400 / 2) = 201
            * r = (Math.max(spot.width, spot.height) / 2) * 1.15 = (Math.max(200, 400) / 2) * 1.15 = 229.99999999999997
        so, top = Math.round(201 + 229.99999999999997) = 431
   */
  expect(tourOverlayComponent).toHaveStyle({
    left: 275,
    marginTop: "2%",
    opacity: 0,
    position: "absolute",
    top: 431
  });

  fireEvent.press(nextTourButton);

  act(() => {
    fireEvent(tourOverlayComponent, "onLayout", {
      nativeEvent: {
        layout: {
          height: buttonMockMeasureData.height,
          width: buttonMockMeasureData.width
        }
      }
    });
  });
  /*
    The next assertion is by using the next equations
   The first position that we selected was Position.TOP line 75, and the align is "screen" line 67
   then:
     left will be equal to "Math.round(cx - (tipLayout.width / 2))"
       where:
            * cx = spot.x + (spot.width / 2) = 10 + (100 / 2) = 60 #Acording with buttonMockMeasureData
            * tipLayout.width =  100 #Acording with buttonMockMeasureData.width
       so, left = Math.round(60 - 50) = 10;
     marginTop = tipMargin fixed with "2%"
     top = Math.round(cy - r - tipLayout.height)
       where:
            * cy = spot.y + (spot.height / 2) = 10 + (50 / 2) = 35
            * r = (Math.max(spot.width, spot.height) / 2) * 1.15 = (Math.max(100, 50) / 2) * 1.15 = 57.49999999999999
            * tipLayout.height = 50
        so, top = Math.round(35 - 57.49999999999999^ - 50) = 72
  */
  expect(tourOverlayComponent).toHaveStyle({
    left: 10,
    marginBottom: "2%",
    position: "absolute",
    top: -72
  });
});
