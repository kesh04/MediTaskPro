import React from "react";
import { Provider } from "react-redux";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { store } from "./src/store";
import AppNavigator from "./src/navigation";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={styles.flex}>
        <AppNavigator />
        <Toast
          position="bottom"
          bottomOffset={90}
          visibilityTime={3000}
          config={{
            success: (props) => <Toast {...props} />,
            error: (props) => <Toast {...props} />,
          }}
        />
      </GestureHandlerRootView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
});

export default App;
