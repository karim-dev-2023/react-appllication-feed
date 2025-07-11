import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Conversations } from "./Conversations";
import { Messages } from "./Messages";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Image, TouchableOpacity } from "react-native";

const iconLogin = require("../../assets/icone-login.png");
const Stack = createStackNavigator();

export const ConversationsNavigation = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ConversationsList"
      component={Conversations}
      options={{
        headerBackTitleVisible: false,
        headerTintColor: "#b972c2",
        headerTransparent: false,
        headerTitleAlign: "center",
        headerStyle: { height: 90, backgroundColor: "#fff6fa" },
        headerLeft: () => (
          <View style={{ marginLeft: 16 }}>
            <Image
              source={iconLogin}
              style={{ width: 38, height: 38, borderRadius: 12 }}
              resizeMode="contain"
            />
          </View>
        ),
        headerTitle: () => (
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 24,
              color: "#b972c2",
              letterSpacing: 0.5,
            }}
          >
            Conversations
          </Text>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              alert("Nouvelle conversation !");
            }}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="chatbubble-ellipses" size={28} color="#b972c2" />
          </TouchableOpacity>
        ),
      }}
    />
    <Stack.Screen
      name="ConversationMessages"
      component={Messages}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);
