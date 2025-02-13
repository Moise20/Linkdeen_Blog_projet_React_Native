import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, Image } from "react-native";
import { Card, Avatar } from "react-native-paper";
import moment from "moment";
import Constants from "expo-constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Carousel from 'react-native-reanimated-carousel';

// Interface pour un Post
interface Post {
  id: string;
  user_id: string;
  user_name: string;
  content: string;
  image_urls?: string[];
  created_at: string;
  likes: number;
  comments: Comment[];
}

// Interface pour un Commentaire
interface Comment {
  id: string;
  user_id: string;
  user_name: string;
  profile_image: string;
  content: string;
  created_at: string;
}

// Props du composant
interface PostCardProps {
  post: Post;
  handleLike: (postId: string) => void;
  handleAddComment: (postId: string, commentText: string) => void;
}

const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;
const screenWidth = Dimensions.get("window").width;

const PostCard: React.FC<PostCardProps> = ({ post, handleLike, handleAddComment }) => {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const onLikePress = async () => {
    if (!liked) {
      setLiked(true);
      handleLike(post.id);
    }
  };

  const renderImage = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />
  );

  return (
    <Card style={styles.postContainer}>
      <Card.Title
        title={post.user_name}
        subtitle={moment(post.created_at).format("DD/MM/YYYY - HH:mm")}
        left={(props) => <Avatar.Icon {...props} icon="account" />}
        titleVariant="titleMedium"
        subtitleVariant="labelSmall"
      />
      <Card.Content>
        <Text style={styles.postContent}>{post.content}</Text>

        {/* 📌 Carrousel d'images si plusieurs sont disponibles */}
        {post.image_urls && Array.isArray(post.image_urls) && post.image_urls.length > 0 && (
          <Carousel
            loop
            width={screenWidth - 32}
            height={250}
            autoPlay={false}
            data={post.image_urls}
            scrollAnimationDuration={1000}
            renderItem={renderImage}
          />
        )}
      </Card.Content>

      {/* 🔥 Boutons Like et Commentaire */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onLikePress} style={styles.actionButton} disabled={liked}>
          <Icon name={liked ? "thumb-up" : "thumb-up-outline"} size={20} color={liked ? "#007bff" : "gray"} />
          <Text>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowComments(!showComments)} style={styles.actionButton}>
          <Icon name="comment-outline" size={20} color="gray" />
          <Text>{post.comments ? post.comments.length : 0}</Text>
        </TouchableOpacity>
      </View>

      {/* 🗨️ Section des commentaires */}
      {showComments && (
        <View style={styles.commentSection}>
          {post.comments.length > 0 ? (
            post.comments.map((comment, index) => (
              <View key={index} style={styles.comment}>
                <Avatar.Image size={32} source={{ uri: comment.profile_image || "https://via.placeholder.com/150" }} />
                <View style={styles.commentTextContainer}>
                  <Text style={styles.commentAuthor}>{comment.user_name || "Utilisateur inconnu"}</Text>
                  <Text style={styles.commentText}>{comment.content}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text>Aucun commentaire pour le moment.</Text>
          )}
          <View style={styles.commentInput}>
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Ajouter un commentaire..."
              style={styles.input}
            />
            <TouchableOpacity onPress={() => handleAddComment(post.id, newComment)}>
              <Icon name="send" size={24} color="#007bff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Card>
  );
};

// 📌 Styles
const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 16,
    backgroundColor: "#FFF",
    borderRadius: 4,
    shadowOpacity: 0.1,
  },
  postContent: {
    fontSize: 14,
    marginVertical: 8,
    color: "#444",
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  actions: {
    flexDirection: "row",
    padding: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  commentInput: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    marginRight: 10,
  },
  commentSection: {
    padding: 10,
  },
  comment: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  commentTextContainer: {
    marginLeft: 10,
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 8,
    flex: 1,
  },
  commentAuthor: {
    fontWeight: "bold",
    color: "#333",
  },
  commentText: {
    fontSize: 14,
    color: "#555",
  },
});

export default PostCard;