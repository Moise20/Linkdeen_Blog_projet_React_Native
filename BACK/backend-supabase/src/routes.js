import express from "express";
import { signUp, login } from "./controllers/authController.js";
import { getPosts, addPost, getComments, addComment, likePost } from "./controllers/postController.js";
import { getProfile, updateProfile } from "./controllers/profileController.js";
import { uploadImage } from "./controllers/uploadController.js";
import { getUsers, getMessages, sendMessage } from "./controllers/messageController.js"; // Importez les nouveaux contrôleurs

const router = express.Router();

// 🔹 Authentification
router.post("/signup", signUp);
router.post("/login", login);

// 🔹 Posts & Commentaires
router.get("/posts", getPosts);
router.post("/posts", addPost);
router.post("/posts/:postId/like", likePost);
router.get("/comments/:postId", getComments);
router.post("/comments", addComment);

// 🔹 Profil utilisateur
router.get("/profile/:userId", getProfile);
router.put("/profile/:userId", updateProfile);

// 🔹 Upload d'image
router.post("/upload_image", uploadImage);

// 🔹 Messagerie
router.get("/users", getUsers); // Récupérer tous les utilisateurs
router.get("/messages/:userId", getMessages); // Récupérer les messages avec un utilisateur spécifique
router.post("/messages", sendMessage); // Envoyer un message

export default router;