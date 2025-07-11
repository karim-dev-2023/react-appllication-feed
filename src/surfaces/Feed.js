import React from "react";
import { View, FlatList, Text, Image, TouchableOpacity, StyleSheet, Alert, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppContext } from "../context/AppContext";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { LinearGradient } from "expo-linear-gradient";

const iconLogin = require("../../assets/icone-login.png");
const { width } = Dimensions.get("window");

const handleSaveImage = async (image) => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission refusée", "Autorisez l'accès à la galerie pour enregistrer l'image.");
      return;
    }
    let fileUri;
    if (image && image.uri) {
      fileUri = FileSystem.cacheDirectory + image.uri.split('/').pop();
      await FileSystem.downloadAsync(image.uri, fileUri);
    } else if (typeof image === "number") {
      const asset = Image.resolveAssetSource(image);
      if (asset && asset.uri) {
        fileUri = asset.uri;
      } else {
        Alert.alert("Erreur", "Impossible de trouver l'image locale.");
        return;
      }
    } else {
      Alert.alert("Erreur", "Format d'image non supporté.");
      return;
    }
    await MediaLibrary.createAssetAsync(fileUri);
    Alert.alert("Succès", "Image enregistrée dans la galerie !");
  } catch (e) {
    Alert.alert("Erreur", "Impossible d'enregistrer l'image.");
  }
};

export const Feed = () => {
  const { posts, toggleFavorite, favorites, saved, toggleSaved } = useAppContext();

  const Header = () => (
    <LinearGradient
      colors={["#fff6fa", "#F5C8C6", "#E1F6F4"]}
      style={styles.headerGradient}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.headerRow}>
        <Image source={iconLogin} style={styles.headerIcon} />
        <Text style={styles.headerTitle}>
          <Text style={{ color: "#b972c2" }}>Lady</Text>
          <Text style={{ color: "#25AD80" }}>Gram</Text>
        </Text>
        <Ionicons name="sparkles" size={32} color="#fff8b5ff" style={{ marginLeft: 10 }} />
      </View>
    </LinearGradient>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff6fa" }}>
      <Header />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              {item.userAvatar ? (
                <Image
                  source={{ uri: item.userAvatar }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarNoPhoto}>
                  <Ionicons name="person-circle" size={36} color="#b972c2" />
                </View>
              )}
              <View>
                <Text style={styles.username}>{item.user}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => handleSaveImage(item.image)}>
              <Image source={item.image} style={styles.image} />
            </TouchableOpacity>
            <Text style={styles.caption}>{item.caption}</Text>
            <View style={styles.likeRow}>
              <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.likeIcon}>
                <Ionicons
                  name={favorites.includes(item.id) ? "heart" : "heart-outline"}
                  size={26}
                  color="#b972c2"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleSaved(item.id)} style={styles.saveIcon}>
                <Ionicons
                  name={saved.includes(item.id) ? "bookmark" : "bookmark-outline"}
                  size={24}
                  color="#25AD80"
                />
              </TouchableOpacity>
              <Text style={styles.likes}>{item.likes} likes</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 18,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#fff",
    shadowColor: "#F5C8C6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    letterSpacing: 1,
    textShadowColor: "#fff",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    margin: 12,
    padding: 16,
    shadowColor: "#b972c2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 3,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#b972c2",
    marginRight: 12,
    backgroundColor: "#fff",
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
  username: { fontWeight: "bold", fontSize: 16, color: "#b972c2" },
  date: { color: "#7f6b8b", fontSize: 12 },
  image: {
    width: "100%",
    height: width > 400 ? 220 : 180,
    borderRadius: 16,
    marginVertical: 10,
    backgroundColor: "#E1F6F4",
  },
  caption: { color: "#7f6b8b", fontSize: 15, marginVertical: 4 },
  likeRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  likeIcon: { marginRight: 8 },
  saveIcon: { marginRight: 8 },
  likes: { color: "#b972c2", fontWeight: "bold" },
});
