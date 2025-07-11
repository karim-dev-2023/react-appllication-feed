import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Conversations } from "./Conversations";
import { Messages } from "./Messages";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Image, TouchableOpacity } from "react-native";

// Importe ton logo
const iconLogin = require("../../assets/icone-login.png");

const Stack = createStackNavigator();

export const ConversationsNavigation = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ConversationsList"
      component={Conversations}
      options={{
        headerBackTitleVisible: false,
        headerTintColor: "#B388FF",
        headerTransparent: false,
        headerTitleAlign: "center",
        headerStyle: { height: 100, backgroundColor: "#fff" },
        // LOGO à gauche
        headerLeft: () => (
          <View style={{ marginLeft: 16 }}>
            <Image
              source={iconLogin}
              style={{ width: 38, height: 38, borderRadius: 12 }}
              resizeMode="contain"
            />
          </View>
        ),
        // TITRE centré
        headerTitle: () => (
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 24,
              color: "#B388FF",
              letterSpacing: 0.5,
            }}
          >
            Conversations
          </Text>
        ),
        // ICONE à droite
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              // Action personnalisée à droite
              alert("Nouvelle conversation !");
            }}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="chatbubble-ellipses" size={28} color="#B388FF" />
          </TouchableOpacity>
        ),
      }}
    />
    <Stack.Screen
      name="ConversationMessages"
      component={Messages}
      options={{
        headerShown: false, // Header custom dans Messages.js
      }}
    />
  </Stack.Navigator>
);
