import React, { useState } from "react";
import { View, TextInput, Image, StyleSheet, TouchableOpacity, Text, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAppContext } from "../context/AppContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export const AddPost = ({ navigation }) => {
  const [caption, setCaption] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const { publishPost } = useAppContext();

  // Demande la permission caméra
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
      navigation.navigate("Feed");
    }
  };

  return (
    <LinearGradient colors={["#E1F6F4", "#F5C8C6"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Créer une publication</Text>
          <TextInput
            placeholder="Légende..."
            value={caption}
            onChangeText={setCaption}
            style={styles.input}
            multiline
            maxLength={120}
          />
          <View style={styles.picRow}>
            <TouchableOpacity style={styles.picBtn} onPress={pickImage}>
              <Ionicons name="image-outline" size={22} color="#B388FF" />
              <Text style={styles.picBtnText}>Galerie</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.picBtn} onPress={takePhoto}>
              <Ionicons name="camera-outline" size={22} color="#B388FF" />
              <Text style={styles.picBtnText}>Photo</Text>
            </TouchableOpacity>
          </View>
          {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
          <TouchableOpacity style={styles.publishBtn} onPress={handlePublish}>
            <Text style={styles.publishBtnText}>Publier</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  // ... styles identiques à la version précédente
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 36,
    paddingHorizontal: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#B388FF",
    marginBottom: 18,
    letterSpacing: 1,
  },
  input: {
    width: "100%",
    minHeight: 48,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eec1e6",
    fontSize: 16,
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
  picBtnText: { color: "#B388FF", fontWeight: "bold", marginLeft: 8 },
  preview: {
    width: 220,
    height: 220,
    borderRadius: 22,
    alignSelf: "center",
    marginBottom: 18,
    borderWidth: 2,
    borderColor: "#B388FF",
    backgroundColor: "#fff",
  },
  publishBtn: {
    backgroundColor: "#B388FF",
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 60,
    elevation: 2,
    marginTop: 12,
  },
  publishBtnText: { color: "#fff", fontWeight: "bold", fontSize: 18, letterSpacing: 1 },
});
