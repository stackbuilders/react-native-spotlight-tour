import "@testing-library/jest-native/extend-expect";
import {
  cleanup,
  fireEvent,
  render,
  RenderAPI,
  waitFor
} from "@testing-library/react-native";

import { buttonMockMeasureData, viewMockMeasureData } from "../setup";

import {
  checkValidIntersection,
  findPropsOnTestInstance
} from "./helpers/helper";
import { getComponentOverTour } from "./spotlight.create.component";

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

const startTour = async (): Promise<RenderAPI> => {
  const renderer = render(getComponentOverTour());

  fireEvent.press(renderer.getByLabelText("Start tour button"));

  await waitFor(() => renderer.getByLabelText("Tour Overlay View"));

  return renderer;
};

describe("Spotlight tour", () => {
  describe("when the tour is not running", () => {
    it("doesn't exist spotlight tour on view before start the tour", () => {
      const { queryByLabelText } = render(getComponentOverTour());
      expect(queryByLabelText("Tour Overlay View")).toBeNull();
    });

    it("shows the overlay after press the start button", async () => {
      const { getByLabelText } = render(getComponentOverTour());

      fireEvent.press(getByLabelText("Start tour button"));

      await waitFor(() => getByLabelText("Tour Overlay View"));
    });
  });

  describe("when the tour overlay starts", () => {
    it("moves to the first spot and the layout will be overlaid by the SVG circle", async () => {
      const { getByLabelText } = render(getComponentOverTour());
      fireEvent.press(getByLabelText("Start tour button"));
      fireEvent.press(getByLabelText("Next spot button"));

      fireEvent(getByLabelText("Tip Overlay View"), "onLayout", {
        nativeEvent: {
          layout: {
            height: viewMockMeasureData.height,
            width: viewMockMeasureData.width
          }
        }
      });

      await waitFor(() => getByLabelText("Svg overlay view"));

      const [svgCircleProps] = findPropsOnTestInstance(
        getByLabelText("Svg overlay view"),
        "AnimatedComponentWrapper"
      );

      const layoutIsOverlayByCircle = checkValidIntersection(
        {
          height: viewMockMeasureData.height,
          width: viewMockMeasureData.width,
          x: viewMockMeasureData.x,
          y: viewMockMeasureData.y
        },
        {
          r: svgCircleProps?.r._value,
          x: svgCircleProps?.cx._value,
          y: svgCircleProps?.cy._value
        }
      );

      expect(layoutIsOverlayByCircle).toBeTruthy();
      expect(svgCircleProps.cx._value).toEqual(101);
      expect(svgCircleProps.cy._value).toEqual(201);
      expect(svgCircleProps.r._value).toEqual(229.99999999999997);

      expect(getByLabelText("Tip Overlay View")).toHaveStyle({
        left: 275,
        marginTop: "2%",
        position: "absolute",
        top: 431
      });
    });

    it("moves to the second spot and the layout will be overlaid by the SVG circle", async () => {
      const { getByLabelText } = render(getComponentOverTour());
      fireEvent.press(getByLabelText("Start tour button"));

      fireEvent.press(getByLabelText("Next spot button"));
      fireEvent.press(getByLabelText("Next spot button"));

      fireEvent(getByLabelText("Tip Overlay View"), "onLayout", {
        nativeEvent: {
          layout: {
            height: buttonMockMeasureData.height,
            width: buttonMockMeasureData.width
          }
        }
      });

      await waitFor(() => getByLabelText("Svg overlay view"));

      const [svgCircleProps] = findPropsOnTestInstance(
        getByLabelText("Svg overlay view"),
        "AnimatedComponentWrapper"
      );
      const layoutIsOverlayByCircle = checkValidIntersection(
        {
          height: buttonMockMeasureData.height,
          width: buttonMockMeasureData.width,
          x: buttonMockMeasureData.x,
          y: buttonMockMeasureData.y
        },
        {
          r: svgCircleProps?.r._value,
          x: svgCircleProps?.cx._value,
          y: svgCircleProps?.cy._value
        }
      );

      expect(layoutIsOverlayByCircle).toBeTruthy();
      expect(svgCircleProps.cx._value).toEqual(60);
      expect(svgCircleProps.cy._value).toEqual(35);
      expect(svgCircleProps.r._value).toEqual(57.49999999999999);
      expect(getByLabelText("Tip Overlay View")).toHaveStyle({
        left: 10,
        marginBottom: "2%",
        position: "absolute",
        top: -72
      });
    });
  });

  describe("when the tour finishes", () => {
    it("stops the tour and unmount the overlay", async () => {
      const { getByLabelText, queryByLabelText } = await startTour();

      fireEvent.press(getByLabelText("Stop tour button"));

      expect(queryByLabelText("Tour Overlay View")).toBeNull();
    });
  });
});