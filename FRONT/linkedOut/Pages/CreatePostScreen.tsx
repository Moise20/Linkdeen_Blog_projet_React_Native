import React, { useState } from "react";
import { View, StyleSheet, Image, ScrollView, Alert } from "react-native";
import { Modal, Button, TextInput, Title, Portal, ActivityIndicator } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import Toast from "react-native-toast-message";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;

const CreatePostModal = ({ visible, onClose, onPost }) => {
  const [message, setMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 📸 **Choisir & Optimiser des images**
  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission requise", "Nous avons besoin d'accéder à votre galerie.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // ✅ Correct
      allowsMultipleSelection: true, // ✅ Permet de choisir plusieurs images
      quality: 1,
    });

    if (!result.canceled) {
      const optimizedImages = await Promise.all(
        result.assets.map(async (asset) => await compressAndConvertImage(asset.uri))
      );

      setSelectedImages([...selectedImages, ...optimizedImages]);
    }
  };

  // 📏 **Compression et optimisation des images**
  const compressAndConvertImage = async (uri: string) => {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1080 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      return manipulatedImage.uri;
    } catch (error) {
      console.error("🚨 Erreur lors de la compression :", error);
      return uri;
    }
  };

  // 📤 **Upload des images**
  const uploadImages = async () => {
    let uploadedUrls: string[] = [];

    for (const imageUri of selectedImages) {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (!fileInfo.exists) {
        Toast.show({ type: "error", text1: "Erreur", text2: "Fichier introuvable." });
        continue;
      }

      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        name: `upload_${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any);

      try {
        const response = await fetch(`${BASE_URL}/upload_image`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          uploadedUrls.push(data.image_url);
        } else {
          Toast.show({ type: "error", text1: "Erreur Upload", text2: data.error });
        }
      } catch (error) {
        console.error("🚨 Erreur upload :", error);
      }
    }

    return uploadedUrls;
  };

  // ✅ **Publier le post**
  const handlePost = async () => {
    if (!message.trim() && selectedImages.length === 0) {
      Toast.show({ type: "error", text1: "Erreur", text2: "Ajoutez du texte ou une image." });
      return;
    }

    setLoading(true);
    const uploadedUrls = await uploadImages();

    try {
      const response = await fetch(`${BASE_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message, images: uploadedUrls }),
      });

      const data = await response.json();
      if (data.success) {
        Toast.show({ type: "success", text1: "Post publié 🎉" });
        onPost(message, uploadedUrls);
        setMessage("");
        setSelectedImages([]);
        onClose();
      } else {
        Toast.show({ type: "error", text1: "Erreur", text2: data.error });
      }
    } catch (error) {
      console.error("🚨 Erreur lors de l'envoi :", error);
      Toast.show({ type: "error", text1: "Erreur", text2: "Impossible d'envoyer le post." });
    }

    setLoading(false);
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
        <Title style={styles.title}>Créer un post</Title>

        <TextInput
          mode="outlined"
          placeholder="Exprimez-vous..."
          value={message}
          onChangeText={setMessage}
          style={styles.input}
          multiline
        />

        {/* 📸 **Affichage des images sélectionnées** */}
        {selectedImages.length > 0 && (
          <ScrollView horizontal style={styles.imageContainer}>
            {selectedImages.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.image} />
            ))}
          </ScrollView>
        )}

        <Button mode="outlined" onPress={pickImages} style={styles.button}>
          Ajouter une photo
        </Button>

        <View style={styles.buttonRow}>
          <Button mode="contained" onPress={handlePost} disabled={loading}>
            {loading ? <ActivityIndicator color="white" /> : "Publier"}
          </Button>
          <Button mode="text" onPress={onClose}>Annuler</Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    alignSelf: "center",
    width: "90%",
    maxWidth: 400,
  },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  input: { marginBottom: 16 },
  imageContainer: { flexDirection: "row", marginBottom: 10 },
  image: { width: 80, height: 80, marginRight: 5, borderRadius: 8 },
  button: { marginBottom: 10 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
});

export default CreatePostModal;
