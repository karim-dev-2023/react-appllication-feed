import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppContext } from "../context/AppContext";
import { Ionicons } from "@expo/vector-icons";

const BOT_STEPS = [
  "Bonjour, comment ça va ?",
  "Que fais-tu de beau ?",
  "Ah profite bien 😄🌸",
  "Bonne journée à toi ☀️🌈",
];

export const Messages = ({ route, navigation }) => {
  const { user, sendMessage, conversations } = useAppContext();
  const { name, avatar, memberId } = route.params;

  const [text, setText]      = useState("");
  const [botStep, setBotStep] = useState(0);
  const flatListRef          = useRef();
  const insets               = useSafeAreaInsets();

  const conv = conversations.find(
    c =>
      (c.user1 === user.id && c.user2 === memberId) ||
      (c.user2 === user.id && c.user1 === memberId)
  );
  const messages = conv ? conv.messages : [];

  const sendBotMessage = (stepIndex) => {
    sendMessage(user.id, BOT_STEPS[stepIndex], memberId, true);
    setBotStep(stepIndex + 1);
  };

  useEffect(() => {
    if (botStep === 0) {
      sendBotMessage(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.from === user.id && botStep < BOT_STEPS.length) {
      setTimeout(() => sendBotMessage(botStep), 900);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const canSend = botStep < BOT_STEPS.length;

  const handleSend = () => {
    if (!canSend || !text.trim()) return;
    sendMessage(memberId, text);
    setText("");
  };

  useEffect(() => {
    if (flatListRef.current) flatListRef.current.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff6fa" }} edges={["left", "right", "top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#b972c2" />
        </TouchableOpacity>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarNoPhoto}>
            <Ionicons name="person-circle" size={36} color="#b972c2" />
          </View>
        )}
        <Text style={styles.username} numberOfLines={1}>{name}</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.from === user.id ? styles.bubbleMe : styles.bubbleOther,
              ]}
            >
              <Text style={{ color: item.from === user.id ? "#fff" : "#22223B" }}>
                {item.text}
              </Text>
            </View>
          )}
        />

        <View style={[styles.inputRow, { paddingBottom: insets.bottom + 6 }]}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Message..."
            placeholderTextColor="#b972c2"
            editable={canSend}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={!canSend}>
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
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: Platform.OS === "ios" ? 18 : 10,
    paddingBottom: 12,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: "#b972c2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    zIndex: 10,
  },
  backBtn: { marginRight: 6, padding: 4 },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 2, borderColor: "#b972c2",
    marginRight: 12, backgroundColor: "#fff",
  },
  avatarNoPhoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#b972c2",
    backgroundColor: "#E1F6F4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  username: { fontWeight: "bold", fontSize: 18, color: "#b972c2", flex: 1, minWidth: 0 },
  bubble: { borderRadius: 16, marginVertical: 6, padding: 12, maxWidth: "75%" },
  bubbleMe: {
    alignSelf: "flex-end",
    backgroundColor: "#b972c2",
  },
  bubbleOther: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderWidth: 1, borderColor: "#E1F6F4",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1, borderColor: "#E1F6F4",
    paddingHorizontal: 12, paddingVertical: 10, minHeight: 56,
    shadowColor: "#b972c2",
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
    borderColor: "#b972c2",
    marginRight: 8,
    fontSize: 16,
    color: "#22223B",
  },
  sendBtn: {
    backgroundColor: "#b972c2",
    borderRadius: 16,
    padding: 12,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
