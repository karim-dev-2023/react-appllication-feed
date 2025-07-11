import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, TextInput, StyleSheet } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "../context/AppContext";

export const Conversations = ({ navigation }) => {
  const headerHeight = useHeaderHeight();
  const { members } = useAppContext();
  const [search, setSearch] = useState("");

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8FF", paddingTop: headerHeight }}>
      <View style={styles.header}>
        <Text style={styles.title}>Conversations</Text>
        <TextInput
          style={styles.search}
          placeholder="Rechercher un membre..."
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("Messages", { name: item.name, avatar: item.avatar, memberId: item.id })
            }
          >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View>
              <Text style={styles.username}>{item.name}</Text>
              <Text style={styles.lastMessage}>{item.lastMessage}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    paddingBottom: 8,
    paddingTop: 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 4,
    elevation: 2,
  },
  title: {
    fontWeight: "bold",
    fontSize: 26,
    color: "#B388FF",
    marginLeft: 18,
    marginBottom: 2,
  },
  search: {
    backgroundColor: "#F8F8FF",
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 18,
    marginBottom: 10,
    borderColor: "#EDEDED",
    borderWidth: 1,
    fontSize: 15,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 14,
    shadowColor: "#B388FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: { width: 54, height: 54, borderRadius: 27, marginRight: 16, borderWidth: 2, borderColor: "#B388FF" },
  username: { fontWeight: "bold", color: "#B388FF", fontSize: 16 },
  lastMessage: { color: "#888", fontSize: 13 },
});
