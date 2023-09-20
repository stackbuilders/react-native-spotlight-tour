import React, { ReactElement } from "react";
import { Button } from "react-native";
import { useSpotlightTour } from "react-native-spotlight-tour";

import { BoldText, ButtonsGroupView, DescriptionText, SpotDescriptionView } from "./App.styles";

export function DocsTooltip(): ReactElement {
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
