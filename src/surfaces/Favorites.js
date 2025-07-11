import React, { useState } from "react";
import { FlatList, View, Image, Text, StyleSheet, Dimensions, TouchableOpacity, Animated, Alert } from "react-native";
import { useAppContext } from "../context/AppContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 14;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

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

export const Favorites = () => {
  const { posts, favorites, saved, toggleFavorite, toggleSaved } = useAppContext();
  const [animatedValue] = useState(new Animated.Value(0));

  const animateCard = () => {
    Animated.sequence([
      Animated.timing(animatedValue, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]).start();
  };

  const likedPosts = posts.filter((p) => favorites.includes(p.id));
  const savedPosts = posts.filter((p) => saved.includes(p.id));

  const renderInnovativeCard = ({ item }) => (
    <Animated.View
      style={[
        styles.card,
        {
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.04],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={() => handleSaveImage(item.image)}>
          <Image source={item.image} style={styles.image} />
        </TouchableOpacity>
        <LinearGradient
          colors={["rgba(245,200,198,0.27)", "rgba(225,246,244,0.55)"]}
          style={styles.imageOverlay}
        />
        <View style={styles.badgeRow}>
          {favorites.includes(item.id) && (
            <View style={styles.badgeHeart}>
              <Ionicons name="heart" size={14} color="#fff" />
            </View>
          )}
          {saved.includes(item.id) && (
            <View style={styles.badgeSave}>
              <Ionicons name="bookmark" size={14} color="#fff" />
            </View>
          )}
        </View>
      </View>
      <Text style={styles.caption} numberOfLines={2}>{item.caption}</Text>
      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => { toggleFavorite(item.id); animateCard(); }}>
          <Ionicons
            name={favorites.includes(item.id) ? "heart" : "heart-outline"}
            size={22}
            color="#b972c2"
            style={{ marginRight: 6 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { toggleSaved(item.id); animateCard(); }}>
          <Ionicons
            name={saved.includes(item.id) ? "bookmark" : "bookmark-outline"}
            size={22}
            color="#25AD80"
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const Header = () => (
    <LinearGradient
      colors={["#E1F6F4", "#F5C8C6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.headerRow}>
        <Ionicons name="star" size={32} color="#b972c2" style={styles.headerIcon} />
        <Text style={styles.headerTitle}>Favoris</Text>
      </View>
      <Text style={styles.headerSubtitle}>Retrouve ici tous tes coups de cœur et tes posts enregistrés 💖</Text>
    </LinearGradient>
  );

  const SectionTitle = ({ icon, color, children, count }) => (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[styles.sectionTitle, { color }]}>{children}</Text>
      <View style={[styles.sectionCount, { backgroundColor: color + "22" }]}>
        <Text style={{ color, fontWeight: "bold", fontSize: 13 }}>{count}</Text>
      </View>
      <View style={styles.sectionLine} />
    </View>
  );

  return (
    <LinearGradient colors={["#fff6fa", "#F5C8C6", "#E1F6F4"]} style={{ flex: 1 }}>
      <Header />

      <SectionTitle icon="heart" color="#b972c2" count={likedPosts.length}>
        Publications Likées
      </SectionTitle>
      <FlatList
        data={likedPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderInnovativeCard}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="heart-outline" size={40} color="#b972c2" style={{ marginBottom: 6 }} />
            <Text style={styles.emptyText}>Aucune publication likée</Text>
          </View>
        }
      />

      <SectionTitle icon="bookmark" color="#25AD80" count={savedPosts.length}>
        Publications Enregistrées
      </SectionTitle>
      <FlatList
        data={savedPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderInnovativeCard}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="bookmark-outline" size={40} color="#25AD80" style={{ marginBottom: 6 }} />
            <Text style={[styles.emptyText, { color: "#25AD80" }]}>Aucune publication enregistrée</Text>
          </View>
        }
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 42,
    paddingBottom: 24,
    paddingHorizontal: 22,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: "#b972c2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  headerIcon: {
    marginRight: 10,
    shadowColor: "#b972c2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 32,
    color: "#b972c2",
    letterSpacing: 1,
    textShadowColor: "#fff",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    color: "#7f6b8b",
    fontSize: 15,
    fontStyle: "italic",
    marginTop: 2,
    marginLeft: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 18,
    marginTop: 16,
    marginBottom: 8,
    gap: 8,
    position: "relative",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 17,
    marginLeft: 4,
    marginRight: 7,
    letterSpacing: 0.2,
  },
  sectionCount: {
    minWidth: 24,
    height: 22,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
    paddingHorizontal: 6,
  },
  sectionLine: {
    height: 2,
    backgroundColor: "#eee",
    flex: 1,
    marginLeft: 8,
    borderRadius: 2,
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
    marginHorizontal: CARD_MARGIN / 2,
  },
  flatListContent: {
    paddingBottom: 10,
    paddingHorizontal: CARD_MARGIN / 2,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: CARD_MARGIN,
    width: CARD_WIDTH,
    alignItems: "center",
    shadowColor: "#b972c2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 4,
    padding: 0,
    position: "relative",
    overflow: "hidden",
    marginTop: 4,
  },
  imageContainer: {
    width: "100%",
    height: CARD_WIDTH,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#F8F8FF",
  },
  image: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    resizeMode: "cover",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  badgeRow: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    gap: 6,
    zIndex: 2,
  },
  badgeHeart: {
    backgroundColor: "#b972c2",
    borderRadius: 10,
    padding: 3,
    marginRight: 2,
    shadowColor: "#b972c2",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeSave: {
    backgroundColor: "#25AD80",
    borderRadius: 10,
    padding: 3,
    shadowColor: "#25AD80",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 2,
    elevation: 2,
  },
  caption: {
    fontWeight: "bold",
    color: "#b972c2",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 5,
    paddingHorizontal: 6,
    minHeight: 36,
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
    marginTop: 4,
  },
  emptyBox: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 20,
    opacity: 0.75,
  },
  emptyText: {
    textAlign: "center",
    color: "#b972c2",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 2,
  },
});
