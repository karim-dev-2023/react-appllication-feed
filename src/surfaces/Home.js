import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feed } from "./Feed";
import { Profile } from "./Profile";
import { Favorites } from "./Favorites";
import { AddPost } from "./AddPost";
import { Ionicons } from "@expo/vector-icons";
import { ConversationsNavigation } from "./ConversationsNavigation";

const Tab = createBottomTabNavigator();

export const Home = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Feed") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Conversations") {
            iconName = focused ? "chatbox" : "chatbox-outline";
          } else if (route.name === "AddPost") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Favorites") {
            iconName = focused ? "heart" : "heart-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#b972c2",
        tabBarInactiveTintColor: "#EDEDED",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#F8F8FF",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          height: 70,
          position: "absolute",
          left: 0,
          bottom: 0,
          right: 0,
        },
      })}
    >
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Conversations" component={ConversationsNavigation} />
      <Tab.Screen name="AddPost" component={AddPost} />
      <Tab.Screen name="Favorites" component={Favorites} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};
