import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "../context/AppContext";
import { Ionicons } from "@expo/vector-icons";

export const Conversations = ({ navigation }) => {
  const { members, conversations, user } = useAppContext();
  const [search, setSearch] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0));

  // Animation d’apparition
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Récupère le dernier message échangé avec chaque membre
  const getLastMessage = (memberId) => {
    const conv = conversations.find(
      (c) =>
        (c.user1 === user.id && c.user2 === memberId) ||
        (c.user2 === user.id && c.user1 === memberId)
    );
    if (conv && conv.messages.length > 0) {
      return conv.messages[conv.messages.length - 1].text;
    }
    return "Démarre une conversation !";
  };

  // Trie les membres avec qui on a déjà discuté en haut
  const sortedMembers = [...members]
    .sort((a, b) => {
      const aConv = conversations.find(
        (c) =>
          (c.user1 === user.id && c.user2 === a.id) ||
          (c.user2 === user.id && c.user1 === a.id)
      );
      const bConv = conversations.find(
        (c) =>
          (c.user1 === user.id && c.user2 === b.id) ||
          (c.user2 === user.id && c.user1 === b.id)
      );
      return (bConv ? 1 : 0) - (aConv ? 1 : 0);
    })
    .filter((m) =>
      m.name.toLowerCase().includes(search.trim().toLowerCase())
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8FF" }}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#B388FF" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un membre..."
            placeholderTextColor="#B388FF"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        {/* Liste des conversations */}
        <FlatList
          data={sortedMembers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate("ConversationMessages", {
                  name: item.name,
                  avatar: item.avatar,
                  memberId: item.id,
                })
              }
            >
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.username}>{item.name}</Text>
                <Text
                  style={styles.lastMessage}
                  numberOfLines={1}
                >
                  {getLastMessage(item.id)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#B388FF" />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucun membre trouvé</Text>
          }
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
    shadowColor: "#B388FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#22223B",
    backgroundColor: "transparent",
    paddingVertical: 0,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 22,
    marginHorizontal: 14,
    marginVertical: 7,
    paddingVertical: 13,
    paddingHorizontal: 14,
    shadowColor: "#B388FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
    borderWidth: 2,
    borderColor: "#B388FF",
    backgroundColor: "#F8F8FF",
  },
  username: {
    fontWeight: "bold",
    fontSize: 17,
    color: "#B388FF",
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  lastMessage: {
    color: "#888",
    fontSize: 14,
    maxWidth: 210,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    color: "#B388FF",
    fontWeight: "bold",
    fontSize: 17,
    opacity: 0.7,
  },
});
