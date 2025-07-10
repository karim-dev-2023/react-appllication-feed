import React from "react";
import { View, FlatList, Pressable, Image, useWindowDimensions } from "react-native";

const arrayOfImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1654157199227-94e56fbed599?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
  },
  // Ajoute d'autres images ici...
];

export const AddedImages = () => {
  const imageWidth = useWindowDimensions().width * 0.4;

  const renderItem = ({ item }) => {
    return (
      <Image
        style={{
          width: imageWidth,
          height: 220,
          borderRadius: 20,
          marginBottom: 32,
          borderColor: "#000000",
        }}
        source={{ uri: item.url }}
      />
    );
  };

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
      <FlatList
        data={arrayOfImages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        snapToInterval={240}
        decelerationRate="fast"
      />
    </View>
  );
};
