import { expect } from "@stackbuilders/assertive-ts";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Sinon from "sinon";

import { AttachStep, SpotlightTourProvider, TourStep, useSpotlightTour } from "../../../../src";
import { SpotlightTour } from "../../../../src/lib/SpotlightTour.context";
import { BASE_STEP } from "../../../helpers/TestTour";

const STEPS = Array.from<TourStep>({ length: 3 }).fill(BASE_STEP);

function TestScreen(): React.ReactElement {
  const { start } = useSpotlightTour();

  useEffect(() => {
    start();
  }, []);

  return (
    <View>
      <AttachStep index={0}>
        <Text>{"Test Tour 1"}</Text>
      </AttachStep>

      <AttachStep index={1}>
        <Text>{"Test Tour 2"}</Text>
      </AttachStep>

      <AttachStep index={2}>
        <Text>{"Test Tour 3"}</Text>
      </AttachStep>
    </View>
  );
}

describe("[Integration] TourOverlay.component.test.tsx", () => {
  context("when the spot is in the first step", () => {
    it("renders the first step", async () => {
      const { getByText } = render(
        <SpotlightTourProvider steps={STEPS}>
          <TestScreen />
        </SpotlightTourProvider>,
      );

      await waitFor(() => getByText("Step 1"));
    });
  });

  context("when the next action is called", () => {
    it("removes the previous step and renders the next step", async () => {
      const { getByText, queryByText } = render(
        <SpotlightTourProvider steps={STEPS}>
          <TestScreen />
        </SpotlightTourProvider>,
      );

      await waitFor(() => getByText("Step 1"));

      fireEvent.press(getByText("Next"));

      await waitFor(() => getByText("Step 2"));

      expect(queryByText("Step 1")).toBeNull();
    });
  });

  context("when previous action is called", () => {
    it("removes the current step and renders the previous step", async () => {
      const { getByText, queryByText } = render(
        <SpotlightTourProvider steps={STEPS}>
          <TestScreen />
        </SpotlightTourProvider>,
      );

      await waitFor(() => getByText("Step 1"));

      fireEvent.press(getByText("Next"));

      await waitFor(() => getByText("Step 2"));

      expect(queryByText("Step 1")).toBeNull();

      fireEvent.press(getByText("Previous"));

      await waitFor(() => getByText("Step 1"));

      expect(queryByText("Step 2")).toBeNull();
    });
  });

  context("when the backdrop behavior is set to continue", () => {
    it("goes to the next step when the backdrop is pressed", async () => {
      const { getByText, findByTestId, queryByText } = render(
        <SpotlightTourProvider steps={STEPS} onBackdropPress="continue">
          <TestScreen />
        </SpotlightTourProvider>,
      );

      await waitFor(() => getByText("Step 1"));

      const backdrop = await findByTestId("Spot Svg");

      fireEvent.press(backdrop);

      await waitFor(() => getByText("Step 2"));

      expect(queryByText("Step 1")).toBeNull();
    });
  });

  context("when the backdrop behavior is set to stop", () => {
    it("stops the tour when the backdrop is pressed", async () => {
      const { getByText, findByTestId, queryByText } = render(
        <SpotlightTourProvider steps={STEPS} onBackdropPress="stop">
          <TestScreen />
        </SpotlightTourProvider>,
      );

      await waitFor(() => getByText("Step 1"));

      const backdrop = await findByTestId("Spot Svg");

      fireEvent.press(backdrop);

      expect(queryByText("Step 1")).toBeNull();
      expect(queryByText("Step 2")).toBeNull();
      expect(queryByText("Step 3")).toBeNull();
    });
  });

  context("when the backdrop behavior is present in the step", () => {
    it("overrides the backdrop press default behavior", async () => {
      const steps = STEPS.map<TourStep>((step, i) => {
        return i === 1
          ? { ...step, onBackdropPress: "stop" }
          : step;
      });

      const { getByText, findByTestId, queryByText } = render(
        <SpotlightTourProvider steps={steps} onBackdropPress="continue">
          <TestScreen />
        </SpotlightTourProvider>,
      );

      await waitFor(() => getByText("Step 1"));

      const backdrop = await findByTestId("Spot Svg");

      fireEvent.press(backdrop);

      await waitFor(() => getByText("Step 2"));

      expect(queryByText("Step 1")).toBeNull();

      fireEvent.press(backdrop);

      expect(queryByText("Step 1")).toBeNull();
      expect(queryByText("Step 2")).toBeNull();
      expect(queryByText("Step 3")).toBeNull();
    });
  });

  context("when a function is passed to the backdrop press behavior", () => {
    it("injects the SpotlightTour object in the options", async () => {
      const spy = Sinon.spy<(options: SpotlightTour) => void>(() => undefined);

      const { getByText, findByTestId } = render(
        <SpotlightTourProvider steps={STEPS} onBackdropPress={spy}>
          <TestScreen />
        </SpotlightTourProvider>,
      );

      await waitFor(() => getByText("Step 1"));

      const backdrop = await findByTestId("Spot Svg");

      fireEvent.press(backdrop);

      Sinon.assert.calledOnceWithExactly(spy, {
        current: 0,
        goTo: Sinon.match.func,
        next: Sinon.match.func,
        previous: Sinon.match.func,
        start: Sinon.match.func,
        stop: Sinon.match.func,
      });
    });
  });

  context("when a function is passed to the onStop prop in the tour provider", () => {
    context("and the tour is stopped", () => {
      it("invokes the function and injects the current index step", async() => {
        const spy = Sinon.spy<(current: number | undefined) => void>(() => undefined);

        const { getByText } = render(
          <SpotlightTourProvider steps={STEPS} onStop={spy}>
            <TestScreen />
          </SpotlightTourProvider>,
        );

        await waitFor(() => getByText("Step 1"));

        fireEvent.press(getByText("Stop"));

        Sinon.assert.calledOnceWithExactly(spy, 0);
      });
    });
  });
});
