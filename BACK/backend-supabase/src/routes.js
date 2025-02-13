import express from "express";
import { signUp, login } from "./controllers/authController.js";
import { getPosts, addPost, getComments, addComment, likePost } from "./controllers/postController.js";
import { getProfile, updateProfile } from "./controllers/profileController.js";
import { uploadImage } from "./controllers/uploadController.js";
import { updateMessage, deleteMessage, createMessage, getMessagesByUser } from "./controllers/messagesController.js"; // Importez les nouveaux contrôleurs

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
// Récupérer tous les messages d'un utilisateur
router.get("/:userId", getMessagesByUser);
 
// Créer un nouveau message
router.post("/", createMessage);
 
// Supprimer un message par ID
router.delete("/:messageId", deleteMessage);
 
// Modifier un message par ID
router.put("/:messageId", updateMessage);

export default router;