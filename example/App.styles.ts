import { Colors } from "react-native/Libraries/NewAppScreen";
import styled from "styled-components/native";

const SectionContainerView = styled.View`
  margin-top: 32px;
  padding-horizontal: 24px;
`;

const TitleText = styled.Text`
  background-color: #D3D3D3;
  font-size: 24px;
  font-weight: 600;
  color: ${Colors.black};
  align-self: flex-start;
`;

const DescriptionText = styled.Text`
  margin-top: 8px;
  font-size: 18px;
  font-weight: 400;
  color: ${Colors.dark};
  align-self: flex-start;
`;

const BoldText = styled.Text`
  font-weight: 700,
`;

const SpotDescriptionView = styled.View`
  background-color: #B0C4DE;
  padding: 10px;
  margin: 10px;
`;

const ButtonsGroupView = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export {
  SectionContainerView,
  TitleText,
  DescriptionText,
  BoldText,
  SpotDescriptionView,
  ButtonsGroupView
};
