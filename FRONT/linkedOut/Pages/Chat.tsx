import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Button, FlatList, Alert, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Importation de l'icône

const BASE_URL = "https://backend-supabase-peach.vercel.app/api";

interface Message {
  id: string;
  sender: string;
  content: string;
  created_at: string;
}

const Chat = ({ route, navigation }: any) => {
  const { userId, userName } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Fonction pour récupérer les messages d'un utilisateur
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${BASE_URL}/messages/${userId}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des messages");
        }

        const data = await response.json();
        console.log("📩 Messages reçus :", data);

        if (!data || !Array.isArray(data.messages)) {
          throw new Error("Les messages reçus ne sont pas un tableau !");
        }

        setMessages(data.messages);
      } catch (error) {
        console.error("Erreur de récupération des messages:", error);
        setMessages([]); // ✅ Empêche l'erreur en définissant un tableau vide
      }
    };

    fetchMessages();
  }, [userId]);


  // Fonction pour envoyer un message
  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    console.log("📤 Envoi du message:", { sender: "You", content: newMessage, user_id: userId });

    try {
      const response = await fetch(`${BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: "You",
          content: newMessage,
          user_id: userId,
        }),
      });

      const data = await response.json(); // Lire la réponse

      console.log("📥 Réponse serveur:", data);

      if (!response.ok) {
        throw new Error(data.error || "Erreur d'envoi du message");
      }

      const newMsg = {
        id: data.message.id, // Prendre l'ID du serveur
        sender: "You",
        content: newMessage,
        created_at: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage("");
    } catch (error) {
      console.error("❌ Erreur d'envoi du message:", error);
    }
  };


  // Fonction pour supprimer un message
  const handleDeleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/messages/${messageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur de suppression du message");
      }

      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
      Alert.alert("Succès", "Message supprimé");
    } catch (error) {
      console.error("Erreur de suppression du message:", error);
    }
  };

  // Fonction pour modifier un message
  const handleEditMessage = async (messageId: string, newContent: string) => {
    try {
      const response = await fetch(`${BASE_URL}/messages/${messageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur de modification du message");
      }

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, content: newContent } : msg
        )
      );
      Alert.alert("Succès", "Message modifié");
    } catch (error) {
      console.error("Erreur de modification du message:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chat avec {userName}</Text>

      <FlatList
        data={Array.isArray(messages) ? messages : []} // ✅ Vérification de messages
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text style={styles.sender}>
              <Text style={{ fontWeight: "bold" }}>{item.sender}</Text>: {item.content}
            </Text>
            <Text style={styles.timestamp}>
              {new Date(item.created_at).toLocaleTimeString()}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()} // ✅ Vérification de l'ID
      />


      {/* Icône d'envoi en bas à droite */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Écrire un message"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Icon name="send" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  message: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
  },
  sender: {
    fontWeight: "bold",
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  sendButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 50,
  },
});

export default Chat;
