import { AppRegistry, Platform } from "react-native";

import appInfo from "./app.json";
import { App } from "./src/App";

AppRegistry.registerComponent(appInfo.name, () => App);

if (Platform.OS === "web") {
  AppRegistry.runApplication(appInfo.name, { rootTag: document.getElementById("root") });
}
