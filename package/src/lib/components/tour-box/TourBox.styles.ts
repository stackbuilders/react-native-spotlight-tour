import { StyleSheet } from "react-native";

import { vh } from "../../../helpers/responsive";

export const Css = StyleSheet.create({
  footerView: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: vh(1),
  },
  mainView: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    justifyContent: "center",
    padding: vh(1),
  },
  navButton: {
    alignItems: "center",
    padding: vh(2),
  },
  titleText: {
    fontWeight: "bold",
  },
});
