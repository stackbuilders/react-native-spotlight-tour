import { AppRegistry, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import appInfo from "./app.json";
import { App } from "./src/App";

function Root() {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
}

AppRegistry.registerComponent(appInfo.name, () => Root);

if (Platform.OS === "web") {
  AppRegistry.runApplication(appInfo.name, { rootTag: document.getElementById("root") });
}
