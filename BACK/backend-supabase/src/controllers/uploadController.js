import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// 🔹 Connexion à Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 🔹 Configuration Multer (Stockage temporaire en mémoire)
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image"); // ✅ Correctement défini ici

// ✅ Controller pour gérer l'upload
export const uploadImage = async (req, res) => {
  // 🔹 Exécuter multer directement dans la fonction
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
      const fileName = `uploads/${Date.now()}_${file.originalname}`;

      console.log("📤 Envoi de l'image :", fileName);

      // 🔹 Upload l'image sur Supabase Storage
      const { data, error } = await supabase.storage
        .from(process.env.SUPABASE_STORAGE_BUCKET)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) {
        console.error("🚨 Erreur lors de l'upload Supabase :", error.message);
        return res.status(500).json({ error: "Erreur lors de l'upload : " + error.message });
      }

      console.log("✅ Upload réussi :", data);

      // 🔹 Générer l'URL publique de l'image
      const { data: publicURL } = supabase.storage
        .from(process.env.SUPABASE_STORAGE_BUCKET)
        .getPublicUrl(fileName);

      if (!publicURL) {
        console.error("🚨 Impossible de récupérer l'URL publique !");
        return res.status(500).json({ error: "Impossible de récupérer l'URL publique" });
      }

      console.log("🌍 URL publique générée :", publicURL);

      return res.json({ success: true, image_url: publicURL.publicUrl }); // 🔹 Stocke seulement l'URL
    } catch (error) {
      console.error("🚨 Erreur serveur :", error.message);
      return res.status(500).json({ error: "Erreur lors de l'upload : " + error.message });
    }
  });
};
