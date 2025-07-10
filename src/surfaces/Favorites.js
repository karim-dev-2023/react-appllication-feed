// src/surfaces/Favorites.js
import React from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";

const MOCK_FAVORITES = [
  { id: '1', user: "Jakob Curtis", image: require("../../assets/sunset.jpg") },
];

export const Favorites = () => (
  <View style={{ flex: 1 }}>
    <FlatList
      data={MOCK_FAVORITES}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.post}>
          <Image source={item.image} style={styles.image} />
          <Text style={styles.username}>{item.user}</Text>
        </View>
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  post: { margin: 16, borderRadius: 12, overflow: "hidden", backgroundColor: "#f6f6f6" },
  image: { width: "100%", height: 180 },
  username: { fontWeight: "bold", margin: 8 },
});
