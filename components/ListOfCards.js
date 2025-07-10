import { Image, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export const ListOfCards = () => {
  const renderItem = ({ item }) => {
    return (
      <Image
        style={{
          width: "100%",
          height: 288,
          borderRadius: 20,
          marginBottom: 32,
        }}
        source={{
          uri: item.url,
        }}
      />
    );
  };

  const arrayOfImages = [
    { id: 1, url: "https://picsum.photos/id/1018/600/288" },
    { id: 2, url: "https://picsum.photos/id/1025/600/288" },
    { id: 3, url: "https://picsum.photos/id/1035/600/288" },
    { id: 4, url: "https://picsum.photos/id/1043/600/288" },
    { id: 5, url: "https://picsum.photos/id/1052/600/288" },
  ];

  return (
    <View style={{ paddingVertical: 30 }}>
      <FlatList
        data={arrayOfImages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
