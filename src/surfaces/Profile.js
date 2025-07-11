import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppContext } from "../context/AppContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 14;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

export const Profile = () => {
  const { user, posts, logout, updateProfile, deletePost } = useAppContext();
  const myPosts = posts.filter((p) => p.authorId === user.id);

  const [modalVisible, setModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState(user.username);
  const [newPassword, setNewPassword] = useState("");
  const [avatarUri, setAvatarUri] = useState(user.avatar);

  useEffect(() => {
    setAvatarUri(user.avatar);
  }, [user.avatar]);

  const pickNewAvatar = async () => {
    Alert.alert(
      "Photo de profil",
      "Choisir une photo de profil",
      [
        {
          text: "Prendre une photo",
          onPress: async () => {
            let result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
            });
            if (!result.canceled && result.assets?.[0]?.uri) {
              setAvatarUri(result.assets[0].uri);
              updateProfile(newUsername, newPassword, result.assets[0].uri);
            }
          },
        },
        {
          text: "Depuis la galerie",
          onPress: async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
            });
            if (!result.canceled && result.assets?.[0]?.uri) {
              setAvatarUri(result.assets[0].uri);
              updateProfile(newUsername, newPassword, result.assets[0].uri);
            }
          },
        },
        { text: "Annuler", style: "cancel" },
      ]
    );
  };

  const removeAvatar = () => {
    Alert.alert(
      "Supprimer la photo",
      "Voulez-vous vraiment supprimer ta photo de profil ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            setAvatarUri(null);
            updateProfile(newUsername, newPassword, null);
          },
        },
      ]
    );
  };

  const handleUpdate = () => {
    updateProfile(newUsername, newPassword, avatarUri);
    setModalVisible(false);
  };

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => {
          Alert.alert(
            "Supprimer",
            "Voulez-vous vraiment supprimer cette publication ?",
            [
              { text: "Annuler", style: "cancel" },
              { text: "Supprimer", style: "destructive", onPress: () => deletePost(item.id) }
            ]
          );
        }}
      >
        <Ionicons name="close-circle" size={26} color="#ff7eb9" />
      </TouchableOpacity>
      <Image source={item.image} style={styles.cardImage} />
      <Text style={styles.cardCaption} numberOfLines={2}>{item.caption}</Text>
      <View style={styles.likesRow}>
        <Ionicons name="heart" size={16} color="#ff7eb9" style={{ marginRight: 4 }} />
        <Text style={styles.likesText}>{item.likes || 0} likes</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={["#E1F6F4", "#F5C8C6"]} style={{ flex: 1 }}>
      {/* Header stylé */}
      <View style={styles.header}>
        {/* Badge de certification petit et brillant en haut à droite */}
        <View style={styles.certifAbsolute}>
          <LinearGradient
            colors={["#f8efc1ff", "#fce356ff", "#fffbe7"]}
            start={{ x: 0.2, y: 0.2 }}
            end={{ x: 1, y: 1 }}
            style={styles.certifGradient}
          >
            <Ionicons
              name="checkmark-circle"
              size={18}
              color="#FFD700"
              style={{
                textShadowColor: "#fff",
                textShadowRadius: 6,
                textShadowOffset: { width: 0, height: 0 }
              }}
            />
            <Text style={styles.certifText}>Celebrities</Text>
          </LinearGradient>
        </View>

        <TouchableOpacity style={styles.avatarWrapper} onPress={pickNewAvatar}>
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarNoPhoto}>
              <Ionicons name="person-circle" size={68} color="#fff" />
            </View>
          )}
          <View style={styles.avatarEdit}>
            <Ionicons name="camera" size={18} color="#fff" />
          </View>
        </TouchableOpacity>
        {avatarUri && (
          <TouchableOpacity style={styles.removePhotoBtn} onPress={removeAvatar}>
            <Ionicons name="trash-outline" size={18} color="#ff7eb9" style={{ marginRight: 4 }} />
            <Text style={styles.removePhotoText}>Supprimer la photo</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.handle}>{user.handle}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.editBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="create-outline" size={18} color="#25AD80" style={{ marginRight: 6 }} />
            <Text style={styles.editBtnText}>Modifier</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={18} color="#b972c2" style={{ marginRight: 6 }} />
            <Text style={styles.logoutBtnText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Stats stylées */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Ionicons name="images" size={20} color="#b972c2" />
          <Text style={styles.statNumber}>{myPosts.length}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="people" size={20} color="#25AD80" />
          <Text style={styles.statNumber}>100M</Text>
          <Text style={styles.statLabel}>Abonnés</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="person-add" size={20} color="#F5C8C6" />
          <Text style={styles.statNumber}>{user.following}</Text>
          <Text style={styles.statLabel}>Abonnements</Text>
        </View>
      </View>

      {/* Mes publications */}
      <Text style={styles.sectionTitle}>Mes publications</Text>
      <FlatList
        data={myPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            <Ionicons name="sad-outline" size={20} color="#b972c2" /> Aucune publication
          </Text>
        }
      />

      {/* Modal édition profil */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier le profil</Text>
            <TextInput
              value={newUsername}
              onChangeText={setNewUsername}
              placeholder="Nouveau pseudo"
              style={styles.input}
              placeholderTextColor="#b972c299"
            />
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nouveau mot de passe"
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#b972c299"
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
    marginTop: 36,
    marginBottom: 18,
    paddingHorizontal: 10,
    position: "relative", // Pour le badge absolu
  },
  certifAbsolute: {
    position: "absolute",
    top: 18,
    right: 20,
    zIndex: 10,
  },
  certifGradient: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: 2,
    paddingHorizontal: 8,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#fff9c4",
  },
  certifText: {
    color: "#FFD700",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 4,
    letterSpacing: 0.2,
    textShadowColor: "#fff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 10,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: "#b972c2",
    backgroundColor: "#fff",
  },
  avatarNoPhoto: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: "#fff6fa",
    backgroundColor: "#b972c2",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarEdit: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#b972c2",
    borderRadius: 14,
    padding: 4,
    elevation: 2,
    zIndex: 2,
  },
  removePhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginBottom: 4,
    marginTop: -2,
    borderWidth: 1,
    borderColor: "#ff7eb9",
    alignSelf: "center",
  },
  removePhotoText: {
    color: "#ff7eb9",
    fontWeight: "bold",
    fontSize: 15,
  },
  username: {
    fontWeight: "bold",
    fontSize: 28,
    color: "#b972c2",
    marginTop: 5,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  handle: { color: "#7f6b8b", marginBottom: 6, textAlign: "center", fontSize: 15 },
  bio: {
    color: "#7f6b8b",
    fontStyle: "italic",
    textAlign: "center",
    marginHorizontal: 18,
    marginBottom: 12,
    fontSize: 15,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 12,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E1F6F4",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 6,
    elevation: 2,
  },
  editBtnText: { color: "#25AD80", fontWeight: "bold", fontSize: 15 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5C8C6",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    elevation: 2,
  },
  logoutBtnText: { color: "#b972c2", fontWeight: "bold", fontSize: 15 },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 18,
    marginHorizontal: 18,
    paddingVertical: 10,
    shadowColor: "#b972c2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  statItem: { alignItems: "center", marginHorizontal: 8 },
  statNumber: { fontWeight: "bold", fontSize: 18, color: "#b972c2", marginTop: 2 },
  statLabel: { color: "#7f6b8b", fontSize: 13 },
  sectionTitle: {
    marginTop: 20,
    marginLeft: 18,
    fontWeight: "bold",
    color: "#b972c2",
    fontSize: 19,
    marginBottom: 6,
    letterSpacing: 0.2,
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
    borderRadius: 18,
    marginBottom: CARD_MARGIN,
    width: CARD_WIDTH,
    alignItems: "center",
    shadowColor: "#b972c2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.11,
    shadowRadius: 10,
    elevation: 3,
    padding: 8,
    position: "relative",
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: CARD_WIDTH,
    borderRadius: 13,
    marginBottom: 8,
    backgroundColor: "#F8F8FF",
  },
  cardCaption: {
    fontWeight: "bold",
    color: "#b972c2",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 2,
    minHeight: 34,
  },
  deleteBtn: {
    position: "absolute",
    top: 14,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 2,
    elevation: 2,
    zIndex: 2,
    shadowColor: "#ff7eb9",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.11,
    shadowRadius: 3,
  },
  likesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    marginBottom: 4,
  },
  likesText: {
    color: "#b972c2",
    fontWeight: "bold",
    fontSize: 13,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#b972c2",
    fontWeight: "bold",
    fontSize: 16,
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 26,
    width: 300,
    alignItems: "center",
  },
  modalTitle: { fontWeight: "bold", fontSize: 19, marginBottom: 12, color: "#b972c2" },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E1F6F4",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    backgroundColor: "#F8F8FF",
    fontSize: 15,
    color: "#b972c2",
  },
  saveBtn: {
    backgroundColor: "#25AD80",
    borderRadius: 16,
    padding: 10,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cancelBtn: {
    marginTop: 8,
    alignSelf: "flex-start",
    marginLeft: 8,
  },
  cancelBtnText: { color: "#b972c2", fontWeight: "bold", fontSize: 15 },
});
