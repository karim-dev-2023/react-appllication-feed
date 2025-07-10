import { View, FlatList, Text, StyleSheet } from "react-native";

export const ListOfMessages = () => {
  const messages = {
    id: 2,
    messages: [
      {
        id: 1,
        type: "to",
        text: "Well, let me start by saying, for those of you who might be confused, I am not Ben Johnson. On the train ride from DC this morning, we passed through Baltimore",
      },
      {
        id: 2,
        type: "from",
        text: "After the 2000 census, Representative Davis maneuvered to have his Congressional District gerrymandered to include as many Republicans as possible",
      },
      {
        id: 3,
        type: "from",
        text: "Genetically advanced agriculture, anti-aging technology, and other advancements we’ve yet to see today will likely push our longevity even farther",
      },
      {
        id: 4,
        type: "to",
        text: "It shouldn’t be surprising, then, that many of the biggest proponents of banning performance enhancing drugs in sports are also suspect of some The Rosenkranz Foundation",
      },
    ],
  };

  const renderItem = ({ item }) => {
    return (
      <View style={item.type === "from" ? styles.textFrom : styles.textTo}>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <FlatList
        data={messages.messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        inverted
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    backgroundColor: "#FAFAFA",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    fontSize: 14,
    padding: 10,
    maxWidth: "65%",
    marginVertical: 14,
  },
  textFrom: {
    borderTopLeftRadius: 20,
    alignSelf: "flex-end",
  },
  textTo: {
    borderTopRightRadius: 20,
    alignSelf: "flex-start",
  },
});
