import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions } from "react-native";
import { Card, Avatar } from "react-native-paper";
import moment from "moment";
import Toast from "react-native-toast-message";
import Constants from "expo-constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Carousel from "react-native-snap-carousel";
import FastImage from "react-native-fast-image";
import PropTypes from 'prop-types';

// Interface pour un Post
interface Post {
  id: string;
  user_id: string;
  user_name: string;
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

// Props du composant
interface PostCardProps {
  post: Post;
  handleLike: (postId: string) => void;
}

const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;
const screenWidth = Dimensions.get("window").width;

const PostCard: React.FC<PostCardProps> = ({ post, handleLike }) => {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const onLikePress = async () => {
    if (liked) return;
    setLiked(true);
    handleLike(post.id);
  };

  const renderImage = ({ item }: { item: string }) => (
    <FastImage source={{ uri: item }} style={styles.image} resizeMode="cover" />
  );

  return (
    <Card style={styles.postContainer}>
      <Card.Title
        title={post.user_name}
        subtitle={moment(post.created_at).format("DD/MM/YYYY - HH:mm")}
        left={(props) => <Avatar.Icon {...props} icon="account" />}
      />
      <Card.Content>
        <Text style={styles.postContent}>{post.content}</Text>

        {/* 📌 Carrousel d'images si plusieurs sont disponibles */}
        {post.image_urls && post.image_urls.length > 0 && (
          <Carousel
            data={post.image_urls}
            renderItem={renderImage}
            sliderWidth={screenWidth - 32}
            itemWidth={screenWidth - 32}
            layout="default"
          />
        )}
      </Card.Content>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onLikePress} style={styles.actionButton}>
          <Icon name="thumb-up-outline" size={20} color={liked ? "#007bff" : "gray"} />
          <Text>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowComments(!showComments)} style={styles.actionButton}>
          <Icon name="comment-outline" size={20} color="gray" />
          <Text>{post.comments ? post.comments.length : 0}</Text>
        </TouchableOpacity>
      </View>

      {showComments && (
        <View style={styles.commentSection}>
          {(post.comments ?? []).map((comment, index) => (
            <View key={index} style={styles.comment}>
              <Text style={styles.commentText}>{comment.content}</Text>
            </View>
          ))}
          <View style={styles.commentInput}>
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Ajouter un commentaire..."
              style={styles.input}
            />
            <TouchableOpacity>
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
  postContainer: { marginBottom: 16 },
  postContent: { fontSize: 14, marginVertical: 8 },
  image: { width: "100%", height: 250, borderRadius: 8 },
  actions: { flexDirection: "row", padding: 10 },
  actionButton: { flexDirection: "row", alignItems: "center", marginRight: 15 },
  commentSection: { padding: 10 },
  comment: { marginBottom: 5 },
  commentText: { fontSize: 14 },
  commentInput: { flexDirection: "row", alignItems: "center" },
  input: { flex: 1, borderBottomWidth: 1, marginRight: 10 },
});

export default PostCard;
