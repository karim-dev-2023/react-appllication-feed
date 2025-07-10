// src/surfaces/AddPost.js
import React, { useState } from "react";
import { View, TextInput, Button, Image, StyleSheet } from "react-native";

export const AddPost = ({ navigation }) => {
  const [caption, setCaption] = useState("");
  // Pour la démo, pas d’upload d’image

  const handleAddPost = () => {
    // Ajoute le post à la liste (utiliser Context ou Redux plus tard)
    navigation.navigate("Feed");
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Écris une légende..."
        value={caption}
        onChangeText={setCaption}
        style={styles.input}
      />
      <Button title="Publier" onPress={handleAddPost} color="#25AD80" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { margin: 24 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 8, marginBottom: 16 },
});
