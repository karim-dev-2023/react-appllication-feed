import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider, useAppContext } from "./src/context/AppContext";
import { createStackNavigator } from "@react-navigation/stack";
import { Home } from "./src/surfaces/Home";
import Login from "./src/surfaces/Login";

const Stack = createStackNavigator();

function AppEntry() {
  const { isAuthenticated } = useAppContext();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} >
      {isAuthenticated ? (
        <Stack.Screen name="Home" component={Home} />
      ) : (
        <Stack.Screen name="Login" component={Login} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <AppEntry />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
