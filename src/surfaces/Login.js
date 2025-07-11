import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppContext } from "../context/AppContext";

const iconLogin = require("../../assets/icone-login.png");
const { width, height } = Dimensions.get("window");

// Génère des bulles pastel animées pour le fond
const Bubble = ({ size, left, delay, color, duration }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration,
          delay,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, []);
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [height, -size],
  });
  return (
    <Animated.View
      style={{
        position: "absolute",
        left,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: 0.18,
        transform: [{ translateY }],
      }}
    />
  );
};

export default function Login() {
  const { login, register } = useAppContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [shake] = useState(new Animated.Value(0));
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animation d'apparition en cascade
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;
  const fadeAnim4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.timing(fadeAnim1, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(fadeAnim2, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(fadeAnim3, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(fadeAnim4, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [isRegister]);

  const handleAuth = () => {
    const ok = isRegister ? register(username, password) : login(username, password);
    if (!ok) {
      setError("Identifiants incorrects");
      Animated.sequence([
        Animated.timing(shake, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
    }
  };

  return (
    <View style={styles.flex}>
      {/* Fond bulles pastel animées */}
      <Bubble size={180} left={width * 0.1} delay={0} color="#B388FF" duration={9000} />
      <Bubble size={120} left={width * 0.7} delay={500} color="#F5C8C6" duration={11000} />
      <Bubble size={100} left={width * 0.5} delay={1500} color="#25AD80" duration={13000} />
      <Bubble size={90} left={width * 0.3} delay={2000} color="#E1F6F4" duration={10000} />
      <Bubble size={60} left={width * 0.8} delay={1000} color="#ff7eb9" duration={12000} />
      <Bubble size={70} left={width * 0.2} delay={2500} color="#fbc2eb" duration={10500} />

      <View style={styles.container}>
        <Animated.View style={{ opacity: fadeAnim1, transform: [{ translateY: fadeAnim1.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] }}>
          <Image source={iconLogin} style={styles.icon} resizeMode="contain" />
        </Animated.View>
        <Animated.Text style={[styles.logo, { opacity: fadeAnim2, transform: [{ translateY: fadeAnim2.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }]}>
          LadyGram
        </Animated.Text>
        <Animated.Text style={[styles.title, { opacity: fadeAnim3, transform: [{ translateY: fadeAnim3.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
          {isRegister ? "Inscription" : "Connexion"}
        </Animated.Text>
        <Animated.View style={{ opacity: fadeAnim4, transform: [{ translateY: fadeAnim4.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }, { translateX: shake }] }}>
          <TextInput
            placeholder="Nom d'utilisateur"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            autoCapitalize="none"
            placeholderTextColor="#b972c299"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Mot de passe"
              value={password}
              onChangeText={setPassword}
              style={styles.inputPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#b972c299"
            />
            <TouchableOpacity
              style={styles.eye}
              onPress={() => setShowPassword((v) => !v)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={22}
                color="#b972c2"
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleAuth} activeOpacity={0.85}>
          <Text style={styles.buttonText}>{isRegister ? "S'inscrire" : "Se connecter"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setIsRegister((v) => !v); setError(""); }}>
          <Text style={styles.switch}>
            {isRegister ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fff6fa" },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  icon: {
    width: 90,
    height: 90,
    marginBottom: 12,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#b972c2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    fontSize: 36,
    color: "#b972c2",
    fontWeight: "bold",
    marginBottom: 6,
    letterSpacing: 1,
    textShadowColor: "#fff",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#b972c2",
    marginBottom: 8,
    marginTop: 18,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  input: {
    width: 260,
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 18,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#eec1e6",
    fontSize: 16,
    color: "#b972c2",
    shadowColor: "#eec1e6",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  passwordContainer: {
    width: 260,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eec1e6",
    marginVertical: 8,
    shadowColor: "#eec1e6",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  inputPassword: {
    flex: 1,
    height: 48,
    paddingHorizontal: 18,
    fontSize: 16,
    color: "#b972c2",
    backgroundColor: "transparent",
  },
  eye: {
    padding: 8,
    marginRight: 4,
  },
  button: {
    backgroundColor: "#b972c2",
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 24,
    marginTop: 18,
    shadowColor: "#b972c2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  error: {
    color: "#ff7eb9",
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
    fontSize: 15,
  },
  switch: {
    marginTop: 18,
    color: "#b972c2",
    fontSize: 15,
    textDecorationLine: "underline",
    fontWeight: "bold",
    letterSpacing: 0.1,
  },
});
