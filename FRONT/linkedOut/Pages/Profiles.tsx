// Profiles.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Button } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';

export const Profiles = () => {
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [username, setUsername] = useState('johndoe123');
  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | undefined>('https://via.placeholder.com/150');



  const toggleEditing = () => {
    setEditing(!editing);
  };

  const selectImage = () => {
    // Ouvre la bibliothèque d'images.
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 300,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.error('Image Picker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          // Met à jour l'image de profil avec le chemin de l'image sélectionnée
          setProfileImage(response.assets[0].uri);
        }
      }
    );
  };

  const renderInput = (label: string, value: string, setValue: React.Dispatch<React.SetStateAction<string>>) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      {editing ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
        />
      ) : (
        <Text style={styles.text}>{value}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Avatar Image */}
      <Avatar.Image 
        size={120} 
        source={{ uri: profileImage }} 
        style={styles.avatar}
      />
      
      {/* Bouton pour changer la photo */}
      <TouchableOpacity style={styles.editPhotoButton} onPress={selectImage}>
        <Text style={styles.editPhotoText}>Changer la photo</Text>
      </TouchableOpacity>

      {/* Champs modifiables */}
      {renderInput('Prénom', firstName, setFirstName)}
      {renderInput('Nom', lastName, setLastName)}
      {renderInput('Pseudo', username, setUsername)}

      {/* Bouton Modifier/Enregistrer */}
      <Button
        mode="contained"
        onPress={toggleEditing}
        style={styles.editButton}
        labelStyle={styles.editButtonText}
      >
        {editing ? 'Enregistrer' : 'Modifier'}
      </Button>
    </View>
  );
};

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
