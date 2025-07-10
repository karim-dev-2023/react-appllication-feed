// src/surfaces/Profile.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const Profile = () => (
  <View style={styles.container}>
    <Text style={styles.name}>Jakob Curtis</Text>
    <View style={styles.stats}>
      <Text>Posts: 8</Text>
      <Text>Abonnés: 123</Text>
      <Text>Abonnements: 128</Text>
    </View>
    {/* Ajoute ici la liste des posts de l'utilisateur */}
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: "center", marginTop: 32 },
  name: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  stats: { flexDirection: "row", justifyContent: "space-around", width: "80%" },
});
