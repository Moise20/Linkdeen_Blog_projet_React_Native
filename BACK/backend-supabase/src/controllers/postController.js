import supabase from "../database.js";

// ✅ Récupérer tous les posts
export const getPosts = async (req, res) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

// ✅ Ajouter un post
export const addPost = async (req, res) => {
  const { userId, content, imageUrl } = req.body;
  if (!userId || !content) return res.status(400).json({ error: "Données manquantes" });

  const { data, error } = await supabase
    .from("posts")
    .insert([{ user_id: userId, content, image_url: imageUrl }]);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true, post: data });
};

// ✅ Récupérer les commentaires d'un post
export const getComments = async (req, res) => {
  const { postId } = req.params;
  if (!postId) return res.status(400).json({ error: "ID du post manquant" });

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

// ✅ Ajouter un commentaire
export const addComment = async (req, res) => {
  const { postId, userId, content } = req.body;
  if (!postId || !userId || !content) return res.status(400).json({ error: "Données manquantes" });

  const { data, error } = await supabase
    .from("comments")
    .insert([{ post_id: postId, user_id: userId, content }]);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true, comment: data });
};
