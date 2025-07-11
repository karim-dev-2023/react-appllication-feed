import React from "react";
import { FlatList, View, Image, Text, StyleSheet, Dimensions } from "react-native";
import { useAppContext } from "../context/AppContext";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

export const Favorites = () => {
  const { posts, favorites } = useAppContext();
  const favoritePosts = posts.filter((p) => favorites.includes(p.id));

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.caption} numberOfLines={2}>{item.caption}</Text>
    </View>
  );

  return (
    <LinearGradient colors={["#F5C8C6", "#E1F6F4"]} style={{ flex: 1 }}>
      <Text style={styles.title}>Mes favoris</Text>
      <FlatList
        data={favoritePosts}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucun favori</Text>}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#B388FF",
    margin: 22,
    textAlign: "center",
    letterSpacing: 1,
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
    marginHorizontal: CARD_MARGIN / 2,
  },
  flatListContent: {
    paddingBottom: 20,
    paddingHorizontal: CARD_MARGIN / 2,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: CARD_MARGIN,
    width: CARD_WIDTH,
    alignItems: "center",
    shadowColor: "#B388FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 2,
    padding: 8,
  },
  image: {
    width: "100%",
    height: CARD_WIDTH,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: "#F8F8FF",
  },
  caption: {
    fontWeight: "bold",
    color: "#B388FF",
    fontSize: 13,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#B388FF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
