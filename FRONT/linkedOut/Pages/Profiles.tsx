import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Avatar, Button } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Profiles = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    pseudo: '',
    profileImage: 'https://via.placeholder.com/150',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [editing, setEditing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // 🔹 Récupérer l'ID utilisateur stocké
  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("user_id");
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        Alert.alert("Erreur", "Utilisateur non connecté");
      }
    };
    fetchUserId();
  }, []);

  // 🔹 Charger les données utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`http://10.7.131.3:1234/profile.php?user_id=${userId}`);
        const data = await response.json();

        if (data.error) {
          Alert.alert("Erreur", data.error);
        } else {
          setUserData(data);
        }
      } catch (error) {
        console.error("🚨 Erreur de récupération des données :", error);
        Alert.alert("Erreur", "Impossible de récupérer les données utilisateur.");
      }
    };

    fetchUserData();
  }, [userId]);

  // 🔹 Enregistrer les modifications
  const handleSave = async () => {
    if (!userId) {
      Alert.alert('Erreur', 'Utilisateur non identifié');
      return;
    }

    if (!userData.firstName || !userData.lastName || !userData.pseudo) {
      Alert.alert('Erreur', 'Tous les champs doivent être remplis.');
      return;
    }

    try {
      const response = await fetch(`http://10.7.131.3:1234/update_profile.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...userData, ...passwords }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert("Succès", "Profil mis à jour avec succès");
        setEditing(false);
        setPasswords({ currentPassword: '', newPassword: '' }); // Reset des champs de mot de passe
      } else {
        Alert.alert("Erreur", data.error);
      }
    } catch (error) {
      console.error("🚨 Erreur de mise à jour :", error);
      Alert.alert("Erreur", "Impossible de mettre à jour le profil");
    }
  };

  // 🔹 Sélectionner une image de profil
  const selectImage = () => {
    if (!editing) {
      Alert.alert('Info', 'Passez en mode édition pour changer la photo.');
      return;
    }

    launchImageLibrary(
      { mediaType: 'photo', maxWidth: 300, maxHeight: 300, quality: 0.8 },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setUserData((prev) => ({
            ...prev,
            profileImage: response.assets[0].uri || prev.profileImage,
          }));
        }
      }
    );
  };

  // 🔹 Afficher un champ éditable ou du texte
  const renderInput = (label: string, field: keyof typeof userData, secureTextEntry = false) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      {editing ? (
        <TextInput
          style={styles.input}
          value={userData[field]}
          onChangeText={(text) => setUserData((prev) => ({ ...prev, [field]: text }))}
          secureTextEntry={secureTextEntry}
        />
      ) : (
        <Text style={styles.text}>{secureTextEntry ? '********' : userData[field]}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Avatar.Image size={120} source={{ uri: userData.profileImage }} style={styles.avatar} />
      <TouchableOpacity style={styles.editPhotoButton} onPress={selectImage}>
        <Text style={[styles.editPhotoText, !editing && styles.disabledText]}>
          Changer la photo
        </Text>
      </TouchableOpacity>

      {renderInput('Prénom', 'firstName')}
      {renderInput('Nom', 'lastName')}
      {renderInput('Email', 'email')}
      {renderInput('Pseudo', 'pseudo')}

      {/* 🔹 Champ du mot de passe actuel */}
      {editing && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mot de passe actuel</Text>
          <TextInput
            style={styles.input}
            value={passwords.currentPassword}
            onChangeText={(text) => setPasswords((prev) => ({ ...prev, currentPassword: text }))}
            secureTextEntry
          />
        </View>
      )}

      {/* 🔹 Champ du nouveau mot de passe */}
      {editing && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nouveau mot de passe</Text>
          <TextInput
            style={styles.input}
            value={passwords.newPassword}
            onChangeText={(text) => setPasswords((prev) => ({ ...prev, newPassword: text }))}
            secureTextEntry
          />
        </View>
      )}

      <Button
        mode="contained"
        onPress={editing ? handleSave : () => setEditing(true)}
        style={styles.editButton}
        labelStyle={styles.editButtonText}
      >
        {editing ? 'Enregistrer' : 'Modifier'}
      </Button>
    </View>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  avatar: { marginBottom: 15 },
  editPhotoButton: { marginBottom: 20 },
  editPhotoText: { color: '#007BFF', fontSize: 16, textDecorationLine: 'underline' },
  disabledText: { color: '#aaa' },
  inputContainer: { width: '100%', marginBottom: 15 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  text: { fontSize: 16, color: '#333' },
  editButton: { marginTop: 20, width: '100%' },
  editButtonText: { fontSize: 16, color: '#fff' },
});

export default Profiles;
