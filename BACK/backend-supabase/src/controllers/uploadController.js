import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// 🔹 Connexion à Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const SUPABASE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "default-bucket"; // 🔹 Vérification du bucket

// 🔹 Configuration Multer (Stockage temporaire en mémoire)
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");

// ✅ **Contrôleur pour l'upload d'images**
export const uploadImage = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("🚨 Erreur Multer :", err.message);
      return res.status(400).json({ error: "Erreur lors du téléversement : " + err.message });
    }

    if (!req.file) {
      console.error("🚨 Aucun fichier reçu !");
      return res.status(400).json({ error: "Aucun fichier reçu" });
    }

    try {
      const file = req.file;
      const fileSize = file.size / (1024 * 1024); // 🔹 Taille en Mo

      // 🔥 **Limiter la taille des fichiers (5 Mo max)**
      if (fileSize > 5) {
        console.error("🚨 Fichier trop volumineux :", fileSize.toFixed(2), "Mo");
        return res.status(400).json({ error: "Le fichier dépasse la limite de 5 Mo." });
      }

      // 🔹 Nom unique du fichier
      const fileName = `uploads/${Date.now()}_${file.originalname}`;

      console.log("📤 Envoi de l'image :", fileName);

      // 🔹 **Upload l'image sur Supabase Storage**
      const { data, error } = await supabase.storage
        .from(SUPABASE_BUCKET)
        .upload(fileName, file.buffer, {
          cacheControl: "3600",
          upsert: false, // 🔥 Ne pas écraser un fichier existant
          contentType: file.mimetype,
        });

      if (error) {
        console.error("🚨 Erreur lors de l'upload Supabase :", error.message);
        return res.status(500).json({ error: "Erreur lors de l'upload : " + error.message });
      }

      console.log("✅ Upload réussi :", data);

      // 🔹 **Générer l'URL publique de l'image**
      const { data: publicURLData } = supabase.storage
        .from(SUPABASE_BUCKET)
        .getPublicUrl(fileName);

      const publicUrl = publicURLData?.publicUrl;
      if (!publicUrl) {
        console.error("🚨 Impossible de récupérer l'URL publique !");
        return res.status(500).json({ error: "Impossible de récupérer l'URL publique" });
      }

      console.log("🌍 URL publique générée :", publicUrl);

      return res.json({ success: true, image_url: publicUrl }); // ✅ Stocke seulement l'URL
    } catch (error) {
      console.error("🚨 Erreur serveur :", error.message);
      return res.status(500).json({ error: "Erreur lors de l'upload : " + error.message });
    }
  });
};
