import React, { useState, useEffect } from "react";
import { View, FlatList } from "react-native";
import { Card } from "./Card";
import AppLoading from "expo-app-loading";
// import { requestBase } from "../utils/constants";

export const ListOfFavorites = () => {
  const [cardList, setCardList] = useState(null);

  const fetchCardData = async () => {
    const response = await fetch(`${requestBase}/home.json`);
    setCardList(await response.json());
  };

  useEffect(() => {
    fetchCardData();
  }, []);

  if (!cardList) {
    return <AppLoading />;
  }

  const renderItem = ({ item }) => {
    return <Card item={item} />;
  };

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <FlatList
        data={cardList.reverse()}
        renderItem={renderItem}
        keyExtractor={(item) => item.itemId}
        showsVerticalScrollIndicator={false}
        snapToInterval={312}
        decelerationRate="fast"
      />
    </View>
  );
};
