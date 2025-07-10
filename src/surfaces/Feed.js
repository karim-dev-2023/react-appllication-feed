// src/surfaces/Feed.js
import React, { useState } from "react";
import { View, FlatList, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const MOCK_POSTS = [
  { id: '1', user: "Jakob Curtis", image: require("../../assets/sunset.jpg"), likes: 8 },
  { id: '2', user: "Charlie Kelly", image: require("../../assets/cocktail2.jpg"), likes: 5 },
];

export const Feed = ({ navigation }) => {
  const [posts, setPosts] = useState(MOCK_POSTS);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.post}
            onPress={() => navigation.navigate("PostDetail", { post: item })}
          >
            <Image source={item.image} style={styles.image} />
            <Text style={styles.username}>{item.user}</Text>
            <Text style={styles.likes}>{item.likes} likes</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  post: { margin: 16, borderRadius: 12, overflow: "hidden", backgroundColor: "#f6f6f6" },
  image: { width: "100%", height: 180 },
  username: { fontWeight: "bold", margin: 8 },
  likes: { marginLeft: 8, color: "#25AD80" },
});
