import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Avatar } from 'react-native-paper';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
interface User {
  id: string;
  firstname: string;
  lastname: string;
  pseudo: string;  // Ajout du pseudo
  profileimage: string; // Ajoute un champ pour l'image si nécessaire
}
 
export const UserList = ({ navigation }: any) => {
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
 
  const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;
 
  // Récupérer les utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      const storedUserId = await AsyncStorage.getItem("user_id");
      setUserId(storedUserId);
 
      if (storedUserId) {
        try {
          const response = await fetch(`${BASE_URL}/users`);
          const data = await response.json();
          setUsers(data.users);
        } catch (error) {
          Alert.alert("Erreur", "Impossible de récupérer les utilisateurs.");
        }
      }
    };
 
    fetchUsers();
  }, []);
 
  const handleUserPress = (item: User) => {
    navigation.navigate('Chat', {
      userId: item.id,
      userName: `${item.firstname} ${item.lastname}`,  // Passe le nom complet de l'utilisateur
    });
  };
 
  const renderUserItem = ({ item }: any) => (
    <View>
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => handleUserPress(item)}  // Passe l'utilisateur entier
      >
        <Avatar.Image size={40} source={{ uri: item.profileImage }} />
        <Text style={styles.userName}>{item.firstname} {item.lastname}</Text>
      </TouchableOpacity>
      {/* Ligne de séparation */}
      <View style={styles.separator} />
    </View>
  );
 
  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
      />
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  userItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  userName: { marginLeft: 15, fontSize: 18 },
  separator: {
    height: 1,
    backgroundColor: 'red',  // Couleur grise légère pour la séparation
    marginVertical: 5,  // Un peu d'espace avant et après la ligne
  },
});