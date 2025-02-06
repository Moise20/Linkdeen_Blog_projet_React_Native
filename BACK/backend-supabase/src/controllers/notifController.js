import supabase from "../database.js";

// ✅ Récupérer tous les posts
export const getNotif = async (req, res) => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

// ✅ Ajouter un post
export const addNotif = async (req, res) => {
  const { userId, type, postId, message } = req.body;
  if (!userId || !postId) return res.status(400).json({ error: "Données manquantes" });

  const { data, error } = await supabase
    .from("notifications")
    .insert([{ user_id: userId, type, post_id: postId, message }]);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true, post: data });
};