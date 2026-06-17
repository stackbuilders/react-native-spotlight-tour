import { AppRegistry, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import appInfo from "./app.json";
import { App } from "./src/App";

AppRegistry.registerComponent(appInfo.name, () => () => (
  <SafeAreaProvider>
    <App />
  </SafeAreaProvider>
));

if (Platform.OS === "web") {
  AppRegistry.runApplication(appInfo.name, { rootTag: document.getElementById("root") });
}
