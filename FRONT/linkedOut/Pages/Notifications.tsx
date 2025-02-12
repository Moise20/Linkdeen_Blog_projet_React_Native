import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Appbar } from "react-native-paper";

interface Notification {
  id: string;
  name: string;
  action: string;
  time: string;
  avatar: string;
}

const notificationsData: Notification[] = [
  {
    id: "1",
    name: "Ahsan",
    action: "just reacted to your post.",
    time: "1 month ago",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    id: "2",
    name: "Mister",
    action: "commented on your post.",
    time: "4 months ago",
    avatar: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    id: "3",
    name: "Curtis",
    action: "just reacted to your post.",
    time: "4 months ago",
    avatar: "https://randomuser.me/api/portraits/men/8.jpg",
  },
  {
    id: "4",
    name: "Darren",
    action: "just reacted to your post.",
    time: "4 months ago",
    avatar: "https://randomuser.me/api/portraits/men/9.jpg",
  },
];

const Notifications = () => {
  return (
    <View style={styles.container}>

      <FlatList
        data={notificationsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.notificationContainer}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.notificationText}>
              <Text style={styles.name}>
                {item.name} <Text style={styles.action}>{item.action}</Text>
              </Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  notificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  notificationText: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold" },
  action: { color: "#555" },
  time: { fontSize: 14, color: "#aaa" },
});

export default Notifications;
