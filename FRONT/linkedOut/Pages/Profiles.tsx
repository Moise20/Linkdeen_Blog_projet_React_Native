import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Avatar, Button } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Assurez-vous du chemin correct

export const Profiles = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    profileImage: 'https://via.placeholder.com/150'
  });
  const [editing, setEditing] = useState(false);

  // Récupérer l'ID de l'utilisateur connecté (à adapter selon votre système d'authentification)
  const userId = 'ID_UTILISATEUR_CONNECTE'; // À remplacer

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data() as any);
        } else {
          Alert.alert('Erreur', 'Utilisateur non trouvé');
        }
      } catch (error) {
        console.error('Erreur de récupération des données :', error);
        Alert.alert('Erreur', 'Impossible de charger les données utilisateur');
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, userData);
      setEditing(false);
      Alert.alert('Succès', 'Profil mis à jour');
    } catch (error) {
      console.error('Erreur de mise à jour :', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
    }
  };

  

  const renderInput = (
    label: string, 
    field: keyof typeof userData
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      {editing ? (
        <TextInput
          style={styles.input}
          value={userData[field]}
          onChangeText={(text) => setUserData(prev => ({...prev, [field]: text}))}
        />
      ) : (
        <Text style={styles.text}>{userData[field]}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Avatar.Image 
        size={120} 
        source={{ uri: userData.profileImage }} 
        style={styles.avatar}
      />
      
      <TouchableOpacity style={styles.editPhotoButton}>
        <Text style={styles.editPhotoText}>Changer la photo</Text>
      </TouchableOpacity>

      {renderInput('Prénom', 'firstName')}
      {renderInput('Nom', 'lastName')}
      {renderInput('Pseudo', 'username')}

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

// Le reste de votre code de styles reste identique


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  avatar: {
    marginBottom: 15,
  },
  editPhotoButton: {
    marginBottom: 20,
  },
  editPhotoText: {
    color: '#007BFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  editButton: {
    marginTop: 20,
    width: '100%',
  },
  editButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default Profiles;
