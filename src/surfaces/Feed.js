// src/surfaces/Feed.js
import React, { useState } from "react";
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { ListOfAvatars } from "../../components/ListOfAvatars";
import { ListOfCards } from "../../components/ListOfCards";

const MOCK_POSTS = [
  {
    id: "1",
    user: "Jakob Curtis",
    image: require("../../assets/sunset.jpg"),
    likes: 8,
  },
  {
    id: "2",
    user: "Charlie Kelly",
    image: require("../../assets/cocktail2.jpg"),
    likes: 5,
  },
];

export const Feed = ({ navigation }) => {
  const headerHeight = useHeaderHeight();
  const [posts, setPosts] = useState(MOCK_POSTS);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: headerHeight }}>
      <View>
        <ListOfAvatars/>
        <ListOfCards/>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  post: {
    margin: 10,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f6f6f6",
  },
  image: { width: "100%", height: 180 },
  username: { fontWeight: "bold", margin: 8 },
  likes: { marginLeft: 8, color: "#25AD80" },
});
