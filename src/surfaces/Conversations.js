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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "../context/AppContext";
import { Ionicons } from "@expo/vector-icons";

export const Conversations = ({ navigation }) => {
  const { members, conversations, user } = useAppContext();
  const [search, setSearch] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff6fa" }}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#b972c2" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un membre..."
            placeholderTextColor="#b972c2"
            value={search}
            onChangeText={setSearch}
          />
        </View>
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
              {item.avatar ? (
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarNoPhoto}>
                  <Ionicons name="person-circle" size={36} color="#b972c2" />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.username}>{item.name}</Text>
                <Text
                  style={styles.lastMessage}
                  numberOfLines={1}
                >
                  {getLastMessage(item.id)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#b972c2" />
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
    shadowColor: "#b972c2",
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
    shadowColor: "#b972c2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#b972c2",
    marginRight: 14,
    backgroundColor: "#fff",
  },
  avatarNoPhoto: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#b972c2",
    backgroundColor: "#E1F6F4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  username: {
    fontWeight: "bold",
    fontSize: 17,
    color: "#b972c2",
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  lastMessage: {
    color: "#7f6b8b",
    fontSize: 14,
    maxWidth: 210,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    color: "#b972c2",
    fontWeight: "bold",
    fontSize: 17,
    opacity: 0.7,
  },
});
