import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Avatar, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import Toast from "react-native-toast-message";

interface ProfilesProps {
  onLogout: () => void;
}

export const Profiles: React.FC<ProfilesProps> = ({ onLogout }) => {
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    pseudo: "",
    profileImage: "https://via.placeholder.com/150",
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;

  // 🔹 Récupérer l'ID utilisateur stocké
  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("user_id");
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        Toast.show({
          type: "error",
          text1: "Erreur",
          text2: "Utilisateur non connecté",
        });
      }
    };
    fetchUserId();
  }, []);

  // 🔹 Charger les données utilisateur
  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/profile/${userId}`);
        const data = await response.json();

        if (data.error) {
          Toast.show({
            type: "error",
            text1: "Erreur",
            text2: data.error,
          });
        } else {
          setUserData(data);
        }
      } catch (error) {
        console.error("🚨 Erreur de récupération des données :", error);
        Toast.show({
          type: "error",
          text1: "Erreur",
          text2: "Impossible de récupérer les données utilisateur.",
        });
      }
      setLoading(false);
    };

    fetchUserData();
  }, [userId]);

  // 🔹 Enregistrer les modifications
  const handleSave = async () => {
    if (!userId) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Utilisateur non identifié",
      });
      return;
    }

    if (!userData.firstname || !userData.lastname || !userData.pseudo) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Tous les champs doivent être remplis.",
      });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (data.success) {
        Toast.show({
          type: "success",
          text1: "Succès",
          text2: "Profil mis à jour avec succès",
        });
        setEditing(false);
      } else {
        Toast.show({
          type: "error",
          text1: "Erreur",
          text2: data.error,
        });
      }
    } catch (error) {
      console.error("🚨 Erreur de mise à jour :", error);
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Impossible de mettre à jour le profil",
      });
    }
  };

  // 🔹 Sélectionner une image de profil
  const selectImage = async () => {
    if (!editing) {
      Toast.show({
        type: "info",
        text1: "Info",
        text2: "Passez en mode édition pour changer la photo.",
      });
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission refusée",
        text2: "Nous avons besoin d'accéder à votre galerie.",
      });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUrl = result.assets[0].uri;
      setUserData((prev) => ({
        ...prev,
        profileImage: imageUrl,
      }));

      // 🔥 Envoyer l'image au backend
      const formData = new FormData();
      formData.append("image", {
        uri: imageUrl,
        name: `profile_${userId}.jpg`,
        type: "image/jpeg",
      } as any);

      try {
        const uploadResponse = await fetch(`${BASE_URL}/upload_image`, {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadResponse.json();
        if (uploadData.success) {
          setUserData((prev) => ({ ...prev, profileImage: uploadData.image_url }));
          Toast.show({
            type: "success",
            text1: "Succès",
            text2: "Photo de profil mise à jour !",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Erreur",
            text2: uploadData.error,
          });
        }
      } catch (error) {
        console.error("🚨 Erreur d'upload :", error);
        Toast.show({
          type: "error",
          text1: "Erreur",
          text2: "Impossible d'envoyer l'image.",
        });
      }
    }
  };

  // 🔹 Déconnexion
  const handleLogout = async () => {
    await AsyncStorage.removeItem("user_id");
    Toast.show({
      type: "success",
      text1: "Déconnexion",
      text2: "Vous avez été déconnecté.",
    });

    onLogout(); // ✅ Appelle `onLogout` pour mettre à jour `isLoggedIn` dans App.tsx
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <TouchableOpacity onPress={selectImage}>
            <Avatar.Image size={120} source={{ uri: userData.profileImage }} style={styles.avatar} />
            {editing && <Text style={styles.editPhotoText}>Changer la photo</Text>}
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={userData.firstname}
            onChangeText={(text) => setUserData((prev) => ({ ...prev, firstname: text }))}
            placeholder="Prénom"
            editable={editing}
          />
          <TextInput
            style={styles.input}
            value={userData.lastname}
            onChangeText={(text) => setUserData((prev) => ({ ...prev, lastname: text }))}
            placeholder="Nom"
            editable={editing}
          />
          <TextInput
            style={styles.input}
            value={userData.pseudo}
            onChangeText={(text) => setUserData((prev) => ({ ...prev, pseudo: text }))}
            placeholder="Pseudo"
            editable={editing}
          />

          <Button mode="contained" onPress={editing ? handleSave : () => setEditing(true)}>
            {editing ? "Enregistrer" : "Modifier"}
          </Button>

          <Button mode="outlined" onPress={handleLogout}>
            Déconnexion
          </Button>
        </>
      )}
    </ScrollView>
  );
};


// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F5F5", // ✅ Fond clair et moderne
  },
  avatar: {
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#007bff", // ✅ Bordure bleue pour l'avatar
  },
  editPhotoText: {
    color: "#007BFF",
    fontSize: 16,
    textDecorationLine: "underline",
    marginTop: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  editButton: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  logoutButton: {
    marginTop: 10,
    width: "100%",
    borderColor: "#007BFF",
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  logoutButtonText: {
    fontSize: 16,
    color: "#007BFF",
    textAlign: "center",
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});


export default Profiles;
