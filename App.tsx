import React from "react";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

import AppNavigator from "./src/navigation";

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
});

export default App;
