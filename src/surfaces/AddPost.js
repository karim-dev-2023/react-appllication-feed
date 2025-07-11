import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAppContext } from "../context/AppContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const SUCCESS_MESSAGES = [
  "Ta création est en ligne, bravo !",
  "Wow, ce post va inspirer la communauté !",
  "Publication réussie, tu es au top !",
  "C’est publié ! Prête à recevoir des likes ?",
  "LadyGram adore ton style !",
  "Partage réussi, la créativité est contagieuse !"
];

// Fond bulles pastel animé
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
        opacity: 0.16,
        transform: [{ translateY }],
      }}
    />
  );
};

// Notification custom LadyGram
const CustomNotification = ({ visible, message, onHide }) => {
  const anim = useRef(new Animated.Value(-100)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(anim, { toValue: 0, useNativeDriver: true }).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(sparkleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(sparkleAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
        ])
      ).start();
      const timeout = setTimeout(() => {
        Animated.timing(anim, { toValue: -100, duration: 400, useNativeDriver: true }).start(() => {
          onHide && onHide();
        });
      }, 9000); // <-- Affiché 6 secondes
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  if (!visible) return null;

  const sparkleScale = sparkleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.25],
  });

  return (
    <Animated.View style={[notifStyles.container, { transform: [{ translateY: anim }] }]}>
      <LinearGradient
        colors={["#F5C8C6", "#B388FF", "#E1F6F4"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={notifStyles.gradient}
      >
        <Animated.View style={{ transform: [{ scale: sparkleScale }] }}>
          <Ionicons name="sparkles" size={28} color="#fff" style={notifStyles.icon} />
        </Animated.View>
        <Text style={notifStyles.text}>{message}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

const notifStyles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 44,
    left: 0,
    right: 0,
    zIndex: 100,
    alignItems: "center",
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 15,
    borderRadius: 32,
    shadowColor: "#b972c2",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 7,
    marginHorizontal: 24,
    backgroundColor: "transparent",
  },
  icon: {
    marginRight: 12,
    shadowColor: "#fff",
    shadowOpacity: 0.7,
    shadowRadius: 8,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
    flex: 1,
    textShadowColor: "#b972c2",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});

export const AddPost = ({ navigation }) => {
  const [caption, setCaption] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const { publishPost } = useAppContext();

  // Notification state
  const [notifVisible, setNotifVisible] = useState(false);
  const [notifMsg, setNotifMsg] = useState("");

  // Apparition animée du formulaire
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, []);

  const askCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission requise", "L'accès à la caméra est nécessaire pour prendre une photo.");
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await askCameraPermission();
    if (!hasPermission) return;
    let result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const handlePublish = async () => {
    if (caption && imageUri) {
      await publishPost(caption, imageUri);
      setCaption("");
      setImageUri(null);

      // Message aléatoire LadyGram
      const msg = SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)];
      setNotifMsg(msg);
      setNotifVisible(true);

      setTimeout(() => navigation.navigate("Feed"), 900);
    }
  };

  return (
    <View style={styles.flex}>
      {/* Notification custom LadyGram */}
      <CustomNotification
        visible={notifVisible}
        message={notifMsg}
        onHide={() => setNotifVisible(false)}
      />

      {/* Fond bulles pastel animées */}
      <Bubble size={170} left={width * 0.12} delay={0} color="#B388FF" duration={9000} />
      <Bubble size={120} left={width * 0.7} delay={500} color="#F5C8C6" duration={11000} />
      <Bubble size={100} left={width * 0.5} delay={1500} color="#25AD80" duration={13000} />
      <Bubble size={90} left={width * 0.3} delay={2000} color="#E1F6F4" duration={10000} />
      <Bubble size={60} left={width * 0.8} delay={1000} color="#ff7eb9" duration={12000} />
      <Bubble size={70} left={width * 0.2} delay={2500} color="#fbc2eb" duration={10500} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] }}>
            <Text style={styles.title}>Créer une publication</Text>
            <View style={[
              styles.captionBox,
              isFocused && styles.captionBoxFocused
            ]}>
              <TextInput
                placeholder={"Exprime-toi en toute créativité..."}
                value={caption}
                onChangeText={setCaption}
                style={styles.input}
                multiline
                maxLength={180}
                textAlign="center"
                textAlignVertical="center"
                placeholderTextColor="#b972c299"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                numberOfLines={6}
                underlineColorAndroid="transparent"
                // padding pour centrer parfaitement le texte et le placeholder
                // (le style input s'en occupe déjà)
              />
            </View>
            <View style={styles.picRow}>
              <TouchableOpacity style={styles.picBtn} onPress={pickImage}>
                <Ionicons name="image-outline" size={22} color="#b972c2" />
                <Text style={styles.picBtnText}>Galerie</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.picBtn} onPress={takePhoto}>
                <Ionicons name="camera-outline" size={22} color="#b972c2" />
                <Text style={styles.picBtnText}>Photo</Text>
              </TouchableOpacity>
            </View>
            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.preview} />
            )}
            <TouchableOpacity
              style={[
                styles.publishBtn,
                !(caption && imageUri) && { opacity: 0.5 },
              ]}
              onPress={handlePublish}
              disabled={!(caption && imageUri)}
              activeOpacity={0.85}
            >
              <Ionicons name="send" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.publishBtnText}>Publier</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fff6fa" },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 36,
    paddingHorizontal: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#b972c2",
    marginBottom: 18,
    letterSpacing: 1,
    textAlign: "center",
    textShadowColor: "#fff",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  captionBox: {
    width: width > 400 ? 360 : "98%",
    height: 130,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#eec1e6",
    shadowColor: "#eec1e6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 2,
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  captionBoxFocused: {
    borderColor: "#b972c2",
    shadowColor: "#b972c2",
    shadowOpacity: 0.18,
    elevation: 4,
  },
  input: {
    width: "100%",
    height: "100%",
    fontSize: 18,
    color: "#b972c2",
    backgroundColor: "transparent",
    textAlign: "center",
    textAlignVertical: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    fontWeight: "500",
    lineHeight: 22,
  },
  picRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    gap: 16,
  },
  picBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E1F6F4",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 18,
    elevation: 2,
  },
  picBtnText: { color: "#b972c2", fontWeight: "bold", marginLeft: 8 },
  preview: {
    width: 220,
    height: 220,
    borderRadius: 22,
    alignSelf: "center",
    marginBottom: 18,
    borderWidth: 2,
    borderColor: "#b972c2",
    backgroundColor: "#fff",
  },
  publishBtn: {
    flexDirection: "row",
    backgroundColor: "#b972c2",
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 44,
    elevation: 2,
    marginTop: 12,
    alignItems: "center",
    alignSelf: "center",
    shadowColor: "#b972c2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
  },
  publishBtnText: { color: "#fff", fontWeight: "bold", fontSize: 18, letterSpacing: 1 },
});
