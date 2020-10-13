import styled from "styled-components/native";

import { vh } from "../../helpers/responsive";

export const MainContainer = styled.View`
  background-color: white;
  border-radius: 8;
  width: 90%;
  align-items: center;
  justify-content: center;
  align-self: center;
  padding: ${vh(1)};
`;

export const TitleText = styled.Text`
  font-weight: bold;
`;

export const FooterContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  margin-top: ${vh(1)};
`;

export const NavButton = styled.TouchableOpacity`
  padding: ${vh(2)};
  align-items: center;
`;
