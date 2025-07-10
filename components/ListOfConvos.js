import React, { useState, useEffect } from "react";
import { View, FlatList, Pressable, Image, Text } from "react-native";

export const ListOfConvos = ({ navigation }) => {
  const userList = [
    {
      id: 1,
      name: "Malena Tudi",
      url: "https://randomuser.me/api/portraits/men/11.jpg",
    },
    {
      id: 2,
      name: "Rimk 2",
      url: "https://randomuser.me/api/portraits/men/12.jpg",
    },
  ];

  const conversationsList = [
    {
      id: 1,
      userId: 2,
      text: "Hey, how's it going?",
    },
    {
      id: 2,
      userId: 1,
      text: "See you tomorrow!",
    },
  ];

  const renderItem = ({ item }) => {
    const currentUser = userList.filter((user) => user.id === item.userId);

    return (
      <Pressable
        onPress={() => {
          console.log("Navigating to Messages via ConversationsNav");
          navigation.navigate("ConversationsNav", {
            screen: "Messages",
            params: {
              name: "Rimk 2",
              avatar: "https://randomuser.me/api/portraits/men/12.jpg",
            },
          });
        }}
        style={{
          height: 103,
          backgroundColor: "rgba(255,255,255,0.6)",
          borderRadius: 33,
          marginBottom: 16,
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            width: 67,
            height: 67,
            borderRadius: 35,
            borderColor: "#000000",
            borderWidth: 1,
            marginHorizontal: 17,
          }}
        >
          <Image
            style={{
              width: 61,
              height: 61,
              borderRadius: 35,
              marginTop: 2,
              marginLeft: 2,
            }}
            source={{ uri: currentUser[0].url }}
          />
        </View>

        <View>
          <Text style={{ fontSize: 14, paddingBottom: 9 }}>
            {currentUser[0].name}
          </Text>
          <Text style={{ color: "#656565", width: "65%" }}>{item.text}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View
      style={{
        paddingTop: 30,
        marginTop: 30,
        marginBottom: 50,
      }}
    >
      <FlatList
        data={conversationsList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        snapToInterval={119}
        decelerationRate="fast"
        ListHeaderComponent={<View style={{ height: 30 }} />}
      />
    </View>
  );
};
