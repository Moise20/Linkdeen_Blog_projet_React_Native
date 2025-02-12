import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { Appbar } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface Message {
  id: string;
  name: string;
  message: string;
  time: string;
  avatar: string;
}

const messagesData: Message[] = [
  {
    id: "1",
    name: "Curtis George",
    message: "Haha, don’t tell her 😎",
    time: "21:07",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "2",
    name: "London, baby!",
    message: "Who needs a map? 🙉",
    time: "21:06",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "3",
    name: "Friendzoned",
    message: "Love this social network 🏆🥂🎉",
    time: "21:05",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: "4",
    name: "Camila Bradley",
    message: "This is awesome 🔥🔥🔥",
    time: "21:05",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: "5",
    name: "Mark Twain",
    message: "This is hilarious 🙉😂",
    time: "20:24",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
];

const Messages = () => {
  const [search, setSearch] = useState("");

  return (
    <View style={styles.container}>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Liste des messages */}
      <FlatList
        data={messagesData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.messageContainer}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.messageText}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.message}>{item.message}</Text>
            </View>
            <Text style={styles.time}>{item.time}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
    margin: 10,
  },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 16 },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  messageText: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold" },
  message: { color: "#555" },
  time: { fontSize: 14, color: "#aaa" },
});

export default Messages;
