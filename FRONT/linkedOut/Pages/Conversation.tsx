import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Constants from "expo-constants";
import Toast from "react-native-toast-message";

const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;

const Conversation = ({ route }) => {
  const { userId, userName } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // 🔹 Charger les messages existants
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${BASE_URL}/messages/${userId}`);
        const data = await response.json();

        if (data.error) {
          Toast.show({ type: "error", text1: "Erreur", text2: "Impossible de charger les messages" });
        } else {
          setMessages(data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        Toast.show({ type: "error", text1: "Erreur", text2: "Erreur de connexion" });
      }
    };

    fetchMessages();
  }, [userId]);

  // 🔹 Envoyer un message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`${BASE_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: userId, // Remplace par l'ID de l'utilisateur connecté
          receiverId: userId,
          content: newMessage,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages([...messages, data.message]); // Ajout immédiat du message
        setNewMessage("");
      } else {
        Toast.show({ type: "error", text1: "Erreur", text2: "Message non envoyé" });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      Toast.show({ type: "error", text1: "Erreur", text2: "Impossible d'envoyer le message" });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{userName}</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>{item.content}</Text>
            <Text style={styles.messageTime}>{new Date(item.created_at).toLocaleTimeString()}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Écrire un message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity onPress={handleSendMessage}>
          <Icon name="send" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#eee" },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  messageBubble: { padding: 10, margin: 10, backgroundColor: "#f0f0f0", borderRadius: 10, alignSelf: "flex-start" },
  messageText: { fontSize: 16 },
  messageTime: { fontSize: 12, color: "#666", marginTop: 5 },
  inputContainer: { flexDirection: "row", alignItems: "center", padding: 10, borderTopWidth: 1, borderTopColor: "#eee" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 20, padding: 10, marginRight: 10 },
});

export default Conversation;
