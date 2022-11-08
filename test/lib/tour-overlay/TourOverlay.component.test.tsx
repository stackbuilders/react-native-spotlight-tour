import { expect } from "@stackbuilders/assertive-ts";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

import { AttachStep, SpotlightTourProvider, useSpotlightTour } from "../../../src";
import { BASE_STEP } from "../../helpers/TestTour";

const STEPS = Array(2).fill(BASE_STEP);

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
    </View>
  );
}

describe("[Integration] TourOverlay.component.test.tsx", () => {
  describe("when the spot is in the first step", () => {
    it("renders the first step", async () => {
      const { getByText } = render(
        <SpotlightTourProvider steps={STEPS}>
          <TestScreen />
        </SpotlightTourProvider>
      );

      await waitFor(() => getByText("Step 1"));
    });
  });

  describe("when the next action is called", () => {
    it("removes the previous step and renders the next step", async () => {
      const { getByText, queryByText } = render(
        <SpotlightTourProvider steps={STEPS}>
          <TestScreen />
        </SpotlightTourProvider>
      );

      await waitFor(() => getByText("Step 1"));

      fireEvent.press(getByText("Next"));

      await waitFor(() => getByText("Step 2"));

      expect(queryByText("Step 1")).toBeNull();
    });
  });

  describe("when previous action is called", () => {
    it("removes the current step and renders the previous step", async () => {
      const { getByText, queryByText } = render(
        <SpotlightTourProvider steps={STEPS}>
          <TestScreen />
        </SpotlightTourProvider>
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
});
