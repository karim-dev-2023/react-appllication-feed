import React, { useState, useRef, useEffect } from "react";
import { View, Text, Image, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "../context/AppContext";
import { Ionicons } from "@expo/vector-icons";

export const Messages = ({ route }) => {
  const { user, sendMessage, conversations } = useAppContext();
  const { name, avatar, memberId } = route.params;
  const [text, setText] = useState("");
  const flatListRef = useRef();

  const conv = conversations.find(
    c => (c.user1 === user.id && c.user2 === memberId) || (c.user2 === user.id && c.user1 === memberId)
  );
  const messages = conv ? conv.messages : [];

  // Simule une réponse automatique de l'utilisateur contacté
  const autoReplies = [
    "Super !", "Merci pour ton message 😊", "Je suis d'accord !", "Haha, trop drôle !", "On se capte plus tard ?"
  ];
  const replyIfNeeded = () => {
    if (text.trim()) {
      setTimeout(() => {
        sendMessage(user.id, autoReplies[Math.floor(Math.random() * autoReplies.length)]);
      }, 1200);
    }
  };

  const handleSend = () => {
    if (text.trim()) {
      sendMessage(memberId, text);
      replyIfNeeded();
      setText("");
    }
  };

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8FF" }}>
      <View style={styles.header}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <Text style={styles.username}>{name}</Text>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={90}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={[
              styles.bubble,
              item.from === user.id ? styles.bubbleMe : styles.bubbleOther
            ]}>
              <Text style={{ color: item.from === user.id ? "#fff" : "#22223B" }}>{item.text}</Text>
            </View>
          )}
          contentContainerStyle={{ padding: 16, paddingBottom: 90 }}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Message..."
            placeholderTextColor="#B388FF"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Ionicons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
    marginBottom: 0,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 10,
    elevation: 2,
  },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12, borderWidth: 2, borderColor: "#B388FF" },
  username: { fontWeight: "bold", fontSize: 18, color: "#B388FF" },
  bubble: {
    borderRadius: 16,
    margin: 6,
    padding: 12,
    maxWidth: "75%",
  },
  bubbleMe: {
    alignSelf: "flex-end",
    backgroundColor: "#B388FF",
  },
  bubbleOther: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E1F6F4",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#E1F6F4",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
    shadowColor: "#B388FF",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.09,
    shadowRadius: 6,
  },
  input: {
    flex: 1,
    backgroundColor: "#F8F8FF",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#B388FF",
    marginRight: 8,
    fontSize: 16,
    color: "#22223B",
  },
  sendBtn: {
    backgroundColor: "#B388FF",
    borderRadius: 16,
    padding: 12,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
