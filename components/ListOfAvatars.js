import React from "react";
import { View, FlatList, Pressable, Image } from "react-native";
import { ListHeaderComponent } from "./ListHeaderComponent";

export const ListOfAvatars = () => {
  const renderItem = ({ item }) => {
    return (
      <Pressable onPress={() => console.log("hello")}>
        <Image
          style={{
            height: 56,
            width: 56,
            borderRadius: 28,
            marginRight: 30,
          }}
          source={{
            uri: item.url,
          }}
        />
      </Pressable>
    );
  };

  const arrayOfAvatars = [
    { id: 1, url: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 2, url: "https://randomuser.me/api/portraits/women/2.jpg" },
    { id: 3, url: "https://randomuser.me/api/portraits/women/3.jpg" },
    { id: 4, url: "https://randomuser.me/api/portraits/women/4.jpg" },
    { id: 5, url: "https://randomuser.me/api/portraits/men/5.jpg" },
    { id: 6, url: "https://randomuser.me/api/portraits/men/6.jpg" },
    { id: 7, url: "https://randomuser.me/api/portraits/men/7.jpg" },
    { id: 8, url: "https://randomuser.me/api/portraits/men/8.jpg" },
    { id: 9, url: "https://randomuser.me/api/portraits/men/9.jpg" },
    { id: 10, url: "https://randomuser.me/api/portraits/women/10.jpg" },
  ];

  return (
    <View
      style={{
        zIndex: 100,
        paddingVertical: 30,
        paddingLeft: 20,
        backgroundColor: "rgba(255,255,255,0.85)",
      }}
    >
      <FlatList
        data={arrayOfAvatars}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        ListHeaderComponent={<ListHeaderComponent />}
        showsHorizontalScrollIndicator={false}
        snapToInterval={86}
        decelerationRate="fast"
      />
    </View>
  );
};
