import React, { useState, useEffect, useCallback } from "react";
import { FlatList, View, ActivityIndicator, StyleSheet, RefreshControl } from "react-native";
import Constants from "expo-constants";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PostCard from "./PostCard";

// Interface pour un Post
interface Post {
  id: string;
  user_id: string;
  user_name?: string;
  content: string;
  image_urls?: string[];
  created_at: string;
  likes: number;
  comments: Comment[];
}

// Interface pour un Commentaire
interface Comment {
  user_id: string;
  content: string;
}

const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;

export const NewsFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState(""); // ✅ Déclare correctement l'état du commentaire

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("user_id");
      if (storedUserId) setCurrentUserId(storedUserId);
    };

    fetchUserId();
    fetchPosts();
  }, []);

  // 🔄 Fonction pour récupérer les posts
  const fetchPosts = async () => {
    try {
      console.log("🟢 Début récupération des posts...");
      const response = await fetch(`${BASE_URL}/posts`);
      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();

      // 🔄 Récupérer les commentaires pour chaque post (évite la boucle infinie)
      const formattedPosts = await Promise.all(
        data.map(async (post) => {
          try {
            const commentsResponse = await fetch(`${BASE_URL}/comments/${post.id}`);
            const commentsData = commentsResponse.ok ? await commentsResponse.json() : [];

            return {
              ...post,
              user_name: post.users?.pseudo || "Utilisateur inconnu",
              image_urls: post.image_urls || [],
              comments: commentsData.map((comment) => ({
                id: comment.id,
                post_id: comment.post_id,
                user_id: comment.user_id,
                content: comment.content,
                created_at: comment.created_at,
                user_name: comment.user_name || "Utilisateur inconnu",
                profile_image: comment.profile_image || "https://via.placeholder.com/150",
              })),
            };
          } catch (error) {
            console.error(`🚨 Erreur récupération des commentaires du post ${post.id}:`, error);
            return post; // 🔹 Retourne le post même s'il y a une erreur
          }
        })
      );


      setPosts(formattedPosts);
    } catch (error) {
      console.error("🚨 Erreur lors de la récupération des posts :", error);
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Impossible de charger les posts.",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  // 🔄 Fonction pour gérer les likes
  const handleLikePost = async (postId: string) => {
    try {
      console.log(`🟢 Tentative d'ajout de like pour le post ${postId}`);

      const response = await fetch(`${BASE_URL}/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (data.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, likes: data.post.likes } : post
          )
        );
      } else {
        Toast.show({ type: "error", text1: "Erreur", text2: "Impossible d'ajouter un like." });
      }
    } catch (error) {
      console.error("🚨 Erreur lors du like :", error);
      Toast.show({ type: "error", text1: "Erreur", text2: "Problème lors du like." });
    }
  };
  const fetchCommentsForPost = async (postId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/comments/${postId}`);
      if (!response.ok) throw new Error("Erreur serveur");

      const commentsData = await response.json();

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: commentsData } // 🔄 Mise à jour du post avec les vrais noms
            : post
        )
      );

      console.log("📌 Mise à jour des commentaires du post :", postId);
    } catch (error) {
      console.error(`🚨 Erreur récupération des commentaires du post ${postId}:`, error);
    }
  };

  // 🔄 Fonction pour ajouter un commentaire
  const handleAddComment = async (postId: string, commentText: string) => {
    if (!commentText.trim()) {
      Toast.show({ type: "error", text1: "Erreur", text2: "Le commentaire ne peut pas être vide." });
      return;
    }

    try {
      console.log("🟢 Ajout du commentaire...");
      const response = await fetch(`${BASE_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId: currentUserId, content: commentText }),
      });

      const data = await response.json();
      console.log("🟢 Réponse serveur :", data);

      if (data.success) {
        const newComment = {
          id: data.comment.id,
          post_id: postId,
          user_id: currentUserId,
          content: commentText,
          created_at: new Date().toISOString(),
          user_name: "Chargement...", // ✅ Met à jour temporairement
          profile_image: "https://via.placeholder.com/150", // Image temporaire
        };

        // 🔹 Mise à jour locale du post concerné (sans attendre le fetch global)
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { 
                  ...post, 
                  comments: [
                    ...post.comments, 
                    {
                      id: data.comment.id, // 🔹 ID unique
                      post_id: postId, 
                      user_id: currentUserId,
                      content: commentText,
                      created_at: new Date().toISOString(), 
                      user_name: "Chargement...",
                      profile_image: "https://via.placeholder.com/150", 
                    } as Comment // ✅ Assure la conformité au type `Comment`
                  ] 
                }
              : post
          )
        );
        

        setNewComment(""); // ✅ Vide l'input après ajout
        console.log("🟢 Commentaire ajouté localement !");

        // 🔄 Rafraîchit uniquement le post concerné pour récupérer les vrais noms
        fetchCommentsForPost(postId);
      } else {
        Toast.show({ type: "error", text1: "Erreur", text2: data.error });
      }
    } catch (error) {
      console.error("🚨 Erreur lors de l'ajout du commentaire :", error);
      Toast.show({ type: "error", text1: "Erreur", text2: "Impossible d'ajouter le commentaire." });
    }
  };


  // 🔄 Rafraîchir les posts en tirant vers le bas
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, []);
// ✅ Ajoute un post immédiatement à la liste
const addNewPost = (newPost) => {
  setPosts((prevPosts) => [newPost, ...prevPosts]); // 🔥 Ajoute en haut de la liste
};

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator animating={true} size="large" color="#6C63FF" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostCard post={item} handleLike={handleLikePost} handleAddComment={handleAddComment} />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F5F5F5" },
});

export default NewsFeed;
