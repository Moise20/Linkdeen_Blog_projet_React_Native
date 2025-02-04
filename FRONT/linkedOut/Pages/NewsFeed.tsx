import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import {
  Button,
  Card,
  Avatar,
  TextInput as PaperInput,
  ActivityIndicator,
  Modal,
  Portal,
  FAB,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import moment from "moment";

export const NewsFeed = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [pseudos, setPseudos] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("user_id");
      setUserId(storedUserId);
    };
    fetchUserId();
    fetchPosts();
    const interval = setInterval(fetchPosts, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/posts`);
      const data = await response.json();
      setPosts(data);
      fetchPseudos(data);
      fetchAllComments(data);
      setLoading(false);
    } catch (error) {
      console.error("🚨 Erreur lors de la récupération des posts :", error);
    }
  };

  const fetchPseudos = async (posts) => {
    let newPseudos = { ...pseudos };
    for (const post of posts) {
      if (!newPseudos[post.user_id]) {
        try {
          const response = await fetch(`${BASE_URL}/profile/${post.user_id}`);
          const data = await response.json();
          newPseudos[post.user_id] = data.pseudo;
        } catch (error) {
          console.error("🚨 Erreur lors de la récupération du pseudo :", error);
        }
      }
    }
    setPseudos(newPseudos);
  };

  const fetchAllComments = async (posts) => {
    let newComments = {};
    for (const post of posts) {
      try {
        const response = await fetch(`${BASE_URL}/comments/${post.id}`);
        const data = await response.json();
        newComments[post.id] = data;
      } catch (error) {
        console.error("🚨 Erreur lors de la récupération des commentaires :", error);
      }
    }
    setComments(newComments);
  };

  const handleAddComment = async (postId) => {
    const commentText = newComments[postId];
    if (!commentText.trim()) return;

    try {
      const response = await fetch(`${BASE_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, postId, content: commentText }),
      });

      const data = await response.json();
      if (data.success) {
        setNewComments((prev) => ({ ...prev, [postId]: "" }));
        fetchAllComments(posts);
      } else {
        Alert.alert("Erreur", data.error);
      }
    } catch (error) {
      console.error("🚨 Erreur lors de l'ajout du commentaire :", error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission requise", "Nous avons besoin d'accéder à votre galerie.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // ✅ Nouvelle syntaxe

      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) return null;

    const formData = new FormData();
    formData.append("image", {
      uri: selectedImage,
      name: "upload.jpg",
      type: "image/jpeg",
    } as any);

    try {
      console.log("📤 Envoi de l'image à :", `${BASE_URL}/upload_image`);
    
      const response = await fetch(`${BASE_URL}/upload_image`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
    
      const responseText = await response.text(); // 🔹 Récupère la réponse sous forme de texte brut
      console.log("📩 Réponse brute du serveur :", responseText); // 🔥 Voir exactement ce que le serveur envoie
    
      const data = JSON.parse(responseText); // 🔹 Convertit en JSON seulement si c'est bien du JSON
    
      if (data.success) {
        return data.image_url; // ✅ Retourne l'URL correcte
      } else {
        Alert.alert("Erreur", "L'upload de l'image a échoué.");
      }
    } catch (error) {
      console.error("🚨 Erreur d'upload :", error);
      Alert.alert("Erreur", "Impossible d'uploader l'image.");
    }
    
    return null;
  };



  const handlePostMessage = async () => {
    if (!userId) {
      Alert.alert("Erreur", "Vous devez être connecté pour poster.");
      return;
    }

    if (!message.trim() && !selectedImage) {
      Alert.alert("Erreur", "Veuillez saisir un message ou sélectionner une image.");
      return;
    }

    setLoading(true);

    let imageUrl = await uploadImage(); // 🔹 Envoie l’image et récupère l’URL

    try {
      const response = await fetch(`${BASE_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          content: message,
          imageUrl,
        }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert("✅ Succès", "Votre post a été publié !");
        setMessage("");
        setSelectedImage(null);
        fetchPosts(); // 🔹 Recharge les posts
        setModalVisible(false);
      } else {
        Alert.alert("🚨 Erreur", data.error);
      }
    } catch (error) {
      console.error("🚨 Erreur de publication :", error);
      Alert.alert("❌ Erreur", "Impossible de publier le message.");
    }

    setLoading(false);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator animating={true} size="large" />
          ) : (
            posts.map((post) => (
              <Card key={post.id} style={styles.postContainer}>
                <Card.Title
                  title={pseudos[post.user_id] || "Utilisateur inconnu"}
                  subtitle={moment(post.created_at).format("DD/MM/YYYY - HH:mm")}
                  titleVariant="titleMedium"
                  subtitleVariant="labelSmall"
                  left={(props) => <Avatar.Icon {...props} icon="account" />}
                />
                <Card.Content>
                  <Text style={styles.postContent}>{post.content}</Text>
                  {post.image_url && typeof post.image_url === "string" && post.image_url.trim() !== "" && (
                    <Card.Cover source={{ uri: encodeURI(post.image_url.trim()) }} style={styles.image} />
                  )}
                  {comments[post.id]?.map((comment, index) => (
                    <View key={index} style={styles.commentContainer}>
                      <Text style={styles.commentAuthor}>{pseudos[post.user_id]} :</Text>
                      <Text style={styles.commentText}>{comment.content}</Text>
                    </View>
                  ))}
                  <PaperInput
                    mode="outlined"
                    label="Ajouter un commentaire..."
                    value={newComments[post.id] || ""}
                    onChangeText={(text) => setNewComments((prev) => ({ ...prev, [post.id]: text }))}
                    style={styles.input}
                  />
                  <Button mode="contained" onPress={() => handleAddComment(post.id)} style={styles.button}>
                    Commenter
                  </Button>
                </Card.Content>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
      <FAB style={styles.fab} icon="plus" onPress={() => setModalVisible(true)} />
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Créer un nouveau post</Text>
          <PaperInput mode="outlined" label="Exprimez-vous..." value={message} onChangeText={setMessage} multiline style={styles.input} />
          <Button mode="contained" onPress={handlePostMessage} style={styles.button}>
            Publier
          </Button>
          <Button mode="contained" onPress={pickImage} style={styles.button}>
            Choisir une image
          </Button>

          {/* Affichage de l’image sélectionnée */}
          {selectedImage && <Image source={{ uri: selectedImage }} style={styles.previewImage} />}

        </Modal>
      </Portal>
    </>
  );
};


const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, padding: 16 },
  container: { width: "100%" },
  postContainer: { marginBottom: 12 },
  postContent: { fontSize: 14, marginVertical: 6 },
  image: { marginTop: 10, height: 200, borderRadius: 8 },
  fab: { position: "absolute", right: 20, bottom: 20, backgroundColor: "#007bff" },

  modalContainer: { backgroundColor: "white", padding: 20, marginHorizontal: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },

});

export default NewsFeed;
