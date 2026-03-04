import React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import DashboardScreen from "../screens/DashboardScreen";
import AddEditTaskScreen from "../screens/AddEditTaskScreen";
import TaskDetailScreen from "../screens/TaskDetailScreen";

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen
          name="AddEditTask"
          component={AddEditTaskScreen}
          options={{ animation: "slide_from_bottom" }}
        />
        <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
