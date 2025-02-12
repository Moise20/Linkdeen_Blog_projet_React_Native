import React, { useState, useEffect, useCallback } from "react";
import { FlatList, View, ActivityIndicator, StyleSheet, RefreshControl } from "react-native";
import Constants from "expo-constants";
import Toast from "react-native-toast-message";
import PostCard from "./PostCard"; 

// Interface pour un Post
interface Post {
  id: string;
  user_id: string;
  user_name?: string;
  content: string;
  image_urls?: string[]; // 📌 Modifié pour gérer plusieurs images
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

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/posts`);
      if (!response.ok) throw new Error("Erreur serveur");
      
      const data = await response.json();
      
      const postsWithUsers = await Promise.all(
        data.map(async (post: Post) => {
          const userResponse = await fetch(`${BASE_URL}/profile/${post.user_id}`);
          if (!userResponse.ok) throw new Error("Erreur chargement profil");
          const userData = await userResponse.json();
          return { ...post, user_name: userData.pseudo, image_urls: post.image_urls || [] };
        })
      );

      setPosts(postsWithUsers);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("🚨 Erreur lors de la récupération des posts :", error);
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Impossible de charger les posts.",
      });
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      
      const data = await response.json();
      if (data.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
          )
        );
      } else {
        Toast.show({
          type: "error",
          text1: "Erreur",
          text2: "Impossible d'ajouter un like.",
        });
      }
    } catch (error) {
      console.error("🚨 Erreur lors du like :", error);
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Problème lors du like.",
      });
    }
  };

  return (
    <View >
      {loading ? (
        <ActivityIndicator animating={true} size="large" color="#6C63FF" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostCard post={item} handleLike={handleLikePost} />}
        />
      )}
    </View>
  );
};
