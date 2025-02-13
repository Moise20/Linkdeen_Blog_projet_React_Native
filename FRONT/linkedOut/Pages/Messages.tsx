import Constants from "expo-constants";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-toast-message";

interface User {
  id: string;
  pseudo: string;
  profileimage: string;
}

const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;

const Messages = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Récupérer les utilisateurs depuis la base de données
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users`);
        const data = await response.json(); // Correction ici ✅
        const text = await response.text();
console.log("📥 Réponse brute de l'API :", text);
        if (data.error) {
          Toast.show({ type: "error", text1: "Erreur", text2: "Impossible de charger les utilisateurs" });
        } else {
          setUsers(data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        Toast.show({ type: "error", text1: "Erreur", text2: "Erreur de connexion" });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 🔹 Gérer le clic sur un utilisateur
  const handleUserPress = (user: User) => {
    navigation.navigate("Conversation", { userId: user.id, userName: user.pseudo });
  };

  // 🔹 Filtrer les utilisateurs en fonction de la recherche
  const filteredUsers = users.filter((user) =>
    user.pseudo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* 🔍 Barre de recherche */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* 📌 Liste des utilisateurs */}
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.userContainer} onPress={() => handleUserPress(item)}>
              <Image source={{ uri: item.profileimage }} style={styles.avatar} />
              <Text style={styles.name}>{item.pseudo}</Text>
            </TouchableOpacity>
          )}
        />
      )}
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
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  name: { fontSize: 16, fontWeight: "bold" },
});

export default Messages;
