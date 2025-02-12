import supabase from "../database.js";

// ✅ Récupérer tous les posts
export const getPosts = async (req, res) => {
  const { data: posts, error: postError } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (postError) return res.status(500).json({ error: postError.message });

  // 🔹 Récupérer tous les commentaires en une seule requête
  const { data: comments, error: commentError } = await supabase
    .from("comments")
    .select("*");

  if (commentError) return res.status(500).json({ error: commentError.message });

  // 🔥 Ajouter les commentaires à chaque post
  const postsWithComments = posts.map((post) => ({
    ...post,
    comments: comments.filter((comment) => comment.post_id === post.id),
  }));

  res.json(postsWithComments);
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

// ✅ Ajouter un Like
export const likePost = async (req, res) => {
  const { postId } = req.params;
  if (!postId) return res.status(400).json({ error: "ID du post manquant" });

  // 🔥 Incrémente le nombre de likes
  const { data, error } = await supabase
    .from("posts")
    .update({ likes: supabase.raw("likes + 1") }) // 🔹 Increment directement en SQL
    .eq("id", postId)
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true, post: data[0] });
};

