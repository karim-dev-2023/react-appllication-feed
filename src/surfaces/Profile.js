import React, { useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppContext } from "../context/AppContext";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

export const Profile = () => {
  const { user, posts, favorites, logout, updateProfile } = useAppContext();
  const myPosts = posts.filter((p) => p.authorId === user.id);

  const [modalVisible, setModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState(user.username);
  const [newPassword, setNewPassword] = useState("");

  const handleUpdate = () => {
    updateProfile(newUsername, newPassword);
    setModalVisible(false);
  };

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />
      <Text style={styles.cardCaption} numberOfLines={2}>{item.caption}</Text>
    </View>
  );

  return (
    <LinearGradient colors={["#E1F6F4", "#F5C8C6"]} style={{ flex: 1 }}>
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.handle}>{user.handle}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.editBtn} onPress={() => setModalVisible(true)}>
            <Text style={styles.editBtnText}>Modifier le profil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutBtnText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{myPosts.length}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.followers}</Text>
          <Text style={styles.statLabel}>Abonnés</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.following}</Text>
          <Text style={styles.statLabel}>Abonnements</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Mes publications</Text>
      <FlatList
        data={myPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucune publication</Text>}
      />

      <Text style={styles.sectionTitle}>Favoris</Text>
      <FlatList
        data={posts.filter((p) => favorites.includes(p.id))}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucun favori</Text>}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier le profil</Text>
            <TextInput
              value={newUsername}
              onChangeText={setNewUsername}
              placeholder="Nouveau pseudo"
              style={styles.input}
            />
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nouveau mot de passe"
              secureTextEntry
              style={styles.input}
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
              <Text style={styles.saveBtnText}>Valider</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 18,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#B388FF",
    marginBottom: 10,
  },
  username: {
    fontWeight: "bold",
    fontSize: 26,
    color: "#B388FF",
    marginTop: 5,
    textAlign: "center",
  },
  handle: { color: "#888", marginBottom: 6, textAlign: "center" },
  bio: {
    color: "#7f6b8b",
    fontStyle: "italic",
    textAlign: "center",
    marginHorizontal: 16,
    marginBottom: 10,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    gap: 10,
  },
  editBtn: {
    backgroundColor: "#E1F6F4",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 6,
    elevation: 2,
  },
  editBtnText: { color: "#25AD80", fontWeight: "bold" },
  logoutBtn: {
    backgroundColor: "#F5C8C6",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    elevation: 2,
  },
  logoutBtnText: { color: "#B388FF", fontWeight: "bold" },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 18,
    marginHorizontal: 18,
    paddingVertical: 8,
  },
  statItem: { alignItems: "center" },
  statNumber: { fontWeight: "bold", fontSize: 18, color: "#B388FF" },
  statLabel: { color: "#777" },
  sectionTitle: {
    marginTop: 18,
    marginLeft: 16,
    fontWeight: "bold",
    color: "#B388FF",
    fontSize: 18,
    marginBottom: 2,
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
  cardImage: {
    width: "100%",
    height: CARD_WIDTH,
    borderRadius: 12,
    marginBottom: 6,
  },
  cardCaption: {
    fontWeight: "bold",
    color: "#B388FF",
    fontSize: 13,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#B388FF",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: 300,
    alignItems: "center",
  },
  modalTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 10 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E1F6F4",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    backgroundColor: "#F8F8FF",
  },
  saveBtn: {
    backgroundColor: "#25AD80",
    borderRadius: 16,
    padding: 10,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "bold" },
  cancelBtn: { marginTop: 8 },
  cancelBtnText: { color: "#B388FF", fontWeight: "bold" },
});
