import express from "express";
import { signUp, login } from "./controllers/authController.js";
import { getPosts, addPost, getComments, addComment } from "./controllers/postController.js";
import { getProfile, updateProfile } from "./controllers/profileController.js";
import { getNotif, addNotif } from "./controllers/notifController.js";
import { uploadImage } from "./controllers/uploadController.js";

const router = express.Router();

// 🔹 Authentification
router.post("/signup", signUp);
router.post("/login", login);

// 🔹 Posts & Commentaires
router.get("/posts", getPosts);
router.post("/posts", addPost);
router.get("/comments/:postId", getComments);
router.post("/comments", addComment);

// 🔹 Profil utilisateur
router.get("/profile/:userId", getProfile);
router.put("/profile/:userId", updateProfile);

// 🔹 Notification
router.get("/notifications", getNotif);
router.put("/notifications", addNotif);

// 🔹 Upload d'image
router.post("/upload_image", uploadImage);

export default router;
