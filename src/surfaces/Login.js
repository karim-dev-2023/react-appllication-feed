import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Easing, Image } from "react-native";
import { useAppContext } from "../context/AppContext";

// Assure-toi que le chemin est correct selon ton projet
const iconLogin = require("../../assets/icone-login.png");

export default function Login() {
  const { login, register } = useAppContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [shake] = useState(new Animated.Value(0));
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleAuth = () => {
    const ok = isRegister ? register(username, password) : login(username, password);
    if (!ok) {
      setError("Identifiants incorrects");
      Animated.sequence([
        Animated.timing(shake, { toValue: 10, duration: 100, useNativeDriver: true, easing: Easing.linear }),
        Animated.timing(shake, { toValue: -10, duration: 100, useNativeDriver: true, easing: Easing.linear }),
        Animated.timing(shake, { toValue: 0, duration: 100, useNativeDriver: true, easing: Easing.linear }),
      ]).start();
    }
  };

  return (
    <View style={styles.container}>
      {/* Icône login */}
      <Image source={iconLogin} style={styles.icon} resizeMode="contain" />

      {/* Titre LadyGram */}
      <Text style={styles.logo}>LadyGram</Text>

      <Text style={styles.title}>{isRegister ? "Inscription" : "Connexion"}</Text>
      <Animated.View style={{ transform: [{ translateX: shake }] }}>
        <TextInput
          placeholder="Nom d'utilisateur"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
      </Animated.View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>{isRegister ? "S'inscrire" : "Se connecter"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsRegister((v) => !v)}>
        <Text style={styles.switch}>
          {isRegister ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff6fa", alignItems: "center", justifyContent: "center" },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  logo: { fontSize: 36, color: "#b972c2", fontWeight: "bold", marginBottom: 6 },
  title: { fontSize: 20, fontWeight: "bold", color: "#b972c2", marginBottom: 5 , marginTop:20},
  input: { width: 260, height: 48, backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 18, marginVertical: 8, borderWidth: 1, borderColor: "#eec1e6", fontSize: 16 },
  button: { backgroundColor: "#b972c2", paddingVertical: 12, paddingHorizontal: 60, borderRadius: 24, marginTop: 18 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  error: { color: "#ff7eb9", fontWeight: "bold", marginTop: 8 },
  switch: { marginTop: 18, color: "#b972c2", fontSize: 15, textDecorationLine: "underline" },
});
