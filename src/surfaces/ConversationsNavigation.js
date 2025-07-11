import { createStackNavigator } from "@react-navigation/stack";
import { Conversations } from "./Conversations";
import { Messages } from "./Messages";

const Stack = createStackNavigator();

export const ConversationsNavigation = () => (
  <Stack.Navigator
    screenOptions={{
      headerBackTitleVisible: false,
      headerTintColor: "#B388FF",
      headerTransparent: true,
      headerTitleAlign: "left",
      headerStyle: { height: 100 },
      headerTitleStyle: {
        textAlign: "left",
        fontWeight: "bold",
        fontSize: 24,
        color: "#B388FF",
      },
    }}
  >
    <Stack.Screen name="Conversations" component={Conversations} />
    <Stack.Screen
      name="Messages"
      component={Messages}
      options={({ route }) => ({
        title: route.params.name,
      })}
    />
  </Stack.Navigator>
);
