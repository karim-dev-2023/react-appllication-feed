import React from "react";
import { View, FlatList, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppContext } from "../context/AppContext";

export const Feed = () => {
  const { posts, toggleFavorite, favorites } = useAppContext();

  return (
    <View style={{ flex: 1, backgroundColor: "#F8F8FF" }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
              <View>
                <Text style={styles.username}>{item.user}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
            </View>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.caption}>{item.caption}</Text>
            <View style={styles.likeRow}>
              <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.likeIcon}>
                <Ionicons
                  name={favorites.includes(item.id) ? "heart" : "heart-outline"}
                  size={26}
                  color="#B388FF"
                />
              </TouchableOpacity>
              <Text style={styles.likes}>{item.likes} likes</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    margin: 12,
    padding: 16,
    shadowColor: "#B388FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12, borderWidth: 2, borderColor: "#B388FF" },
  username: { fontWeight: "bold", fontSize: 16, color: "#B388FF" },
  date: { color: "#888", fontSize: 12 },
  image: { width: "100%", height: 220, borderRadius: 16, marginVertical: 10 },
  caption: { color: "#22223B", fontSize: 15, marginVertical: 4 },
  likeRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  likeIcon: { marginRight: 8 },
  likes: { color: "#B388FF", fontWeight: "bold" },
});
