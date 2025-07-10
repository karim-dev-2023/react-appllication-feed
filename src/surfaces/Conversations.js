// src/surfaces/Conversations.js
import React from "react";
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from "react-native";

const MOCK_CONVOS = [
  { id: '1', name: "Jakob Curtis", lastMessage: "Hey, how's it going?" },
  { id: '2', name: "Charlie Kelly", lastMessage: "See you soon!" },
];

export const Conversations = ({ navigation }) => (
  <View style={{ flex: 1 }}>
    <FlatList
      data={MOCK_CONVOS}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate("Chat", { user: item.name })}
        >
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.message}>{item.lastMessage}</Text>
        </TouchableOpacity>
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  row: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
  name: { fontWeight: "bold" },
  message: { color: "#888" },
});
