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
  const [botStep, setBotStep] = useState(0);   // 0 ➜ rien envoyé, 4 ➜ fin
  const flatListRef          = useRef();
  const insets               = useSafeAreaInsets();

  /* ------------------------------------------------------------------ */
  /*  Récupère la conversation courante et ses messages                 */
  /* ------------------------------------------------------------------ */
  const conv = conversations.find(
    c =>
      (c.user1 === user.id && c.user2 === memberId) ||
      (c.user2 === user.id && c.user1 === memberId)
  );
  const messages = conv ? conv.messages : [];

  /* ------------------------------------------------------------------ */
  /*  Fonction utilitaire : envoie un message du bot                    */
  /* ------------------------------------------------------------------ */
  const sendBotMessage = (stepIndex) => {
    // (destId,       texte,           fromId,   isBot)
    sendMessage(user.id, BOT_STEPS[stepIndex], memberId, true);
    setBotStep(stepIndex + 1);
  };

  /* ------------------------------------------------------------------ */
  /*  1) Au premier affichage : le bot dit “Bonjour...”                 */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (botStep === 0) {
      sendBotMessage(0); // envoie « Bonjour, comment ça va ? »
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------------------------------------------------------ */
  /*  2) Chaque fois que l’utilisateur répond, le bot envoie la suite   */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];

    // Si le dernier message vient de l’utilisateur et qu'il reste des étapes
    if (lastMsg.from === user.id && botStep < BOT_STEPS.length) {
      setTimeout(() => sendBotMessage(botStep), 900);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  /* ------------------------------------------------------------------ */
  /*  3) Gestion de l’envoi par l’utilisateur                           */
  /* ------------------------------------------------------------------ */
  const canSend = botStep < BOT_STEPS.length;        // désactive à la fin

  const handleSend = () => {
    if (!canSend || !text.trim()) return;
    sendMessage(memberId, text);   // ton message au destinataire
    setText("");
  };

  /* ------------------------------------------------------------------ */
  /*  4) Scroll automatique vers le bas                                 */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (flatListRef.current) flatListRef.current.scrollToEnd({ animated: true });
  }, [messages]);

  /* =========================== RENDER =============================== */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8FF" }} edges={["left", "right", "top"]}>
      {/* ---------- Header ---------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#B388FF" />
        </TouchableOpacity>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <Text style={styles.username} numberOfLines={1}>{name}</Text>
      </View>

      {/* ---------- Messages + input ---------- */}
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
            placeholderTextColor="#B388FF"
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

/* =========================== STYLES =============================== */
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
    shadowColor: "#B388FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    zIndex: 10,
  },
  backBtn: { marginRight: 6, padding: 4 },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 2, borderColor: "#B388FF",
    marginRight: 12, backgroundColor: "#F8F8FF",
  },
  username: { fontWeight: "bold", fontSize: 18, color: "#B388FF", flex: 1, minWidth: 0 },

  bubble: { borderRadius: 16, marginVertical: 6, padding: 12, maxWidth: "75%" },
  bubbleMe: {
    alignSelf: "flex-end",
    backgroundColor: "#B388FF",           // toi ➜ à droite, fond violet
  },
  bubbleOther: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",              // bot ➜ à gauche, fond blanc
    borderWidth: 1, borderColor: "#E1F6F4",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1, borderColor: "#E1F6F4",
    paddingHorizontal: 12, paddingVertical: 10, minHeight: 56,
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
