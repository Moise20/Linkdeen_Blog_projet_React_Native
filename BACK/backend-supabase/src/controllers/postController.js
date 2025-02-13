import supabase from "../database.js";

// ✅ Récupérer tous les posts + leurs commentaires
export const getPosts = async (req, res) => {
  try {
    // 🔹 Récupérer les posts avec le pseudo de l'utilisateur
    const { data: posts, error: postError } = await supabase
      .from("posts")
      .select(`
        id,
        user_id,
        content,
        image_urls,
        created_at,
        likes,
        users (pseudo)  // ✅ Jointure avec la table users pour récupérer le pseudo
      `)
      .order("created_at", { ascending: false });

    if (postError) {
      console.error("🚨 Erreur lors de la récupération des posts :", postError.message);
      return res.status(500).json({ error: postError.message });
    }

    // 🔹 Récupérer tous les commentaires
    const { data: comments, error: commentError } = await supabase
      .from("comments")
      .select("*");

    if (commentError) return res.status(500).json({ error: commentError.message });

    // 🔹 Formater les posts (ajouter pseudo + attacher les commentaires)
    const formattedPosts = posts.map(post => ({
      ...post,
      user_name: post.users.pseudo || "Utilisateur inconnu", // ✅ Associe le pseudo
      image_urls: post.image_urls || [], // ✅ Utilise directement le tableau JSON
      comments: comments.filter(comment => comment.post_id === post.id), // ✅ Associe les commentaires
    }));

    console.log("📌 Posts formatés avec pseudos et images :", formattedPosts);
    res.json(formattedPosts);
  } catch (error) {
    console.error("🚨 Erreur serveur :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};




// ✅ Ajouter un post avec plusieurs images
export const addPost = async (req, res) => {
  console.log("🟢 Début de l'ajout du post");

  try {
    const { userId, content, imageUrls } = req.body;
    console.log("🟢 Données reçues :", { userId, content, imageUrls });

    if (!userId) {
      console.log("🔴 Erreur : userId manquant");
      return res.status(400).json({ error: "ID utilisateur manquant" });
    }

    if (!content) {
      console.log("🔴 Erreur : contenu manquant");
      return res.status(400).json({ error: "Le contenu ne peut pas être vide" });
    }

    const imageUrlsArray = Array.isArray(imageUrls) ? imageUrls : [];
    console.log("🟢 URLs des images :", imageUrlsArray);

    const { data, error } = await supabase
      .from("posts")
      .insert([{
        user_id: userId,
        content,
        image_urls: imageUrlsArray.length > 0 ? imageUrlsArray : null, // ✅ Stocke directement un tableau JSON
      }])
      .select("*");

    if (error) {
      console.error("🔴 Erreur Supabase :", error.message);
      return res.status(500).json({ error: error.message });
    }

    console.log("🟢 Post ajouté avec succès :", data[0]);
    res.json({ success: true, post: data[0] });
  } catch (error) {
    console.error("🔴 Erreur serveur :", error.message);
    res.status(500).json({ error: "Erreur serveur lors de l'ajout du post." });
  }
};


// ✅ Récupérer les commentaires d'un post
export const getComments = async (req, res) => {
  const { postId } = req.params;
  if (!postId) return res.status(400).json({ error: "ID du post manquant" });

  const { data, error } = await supabase
    .from("comments")
    .select("id, post_id, user_id, content, created_at, users(pseudo, profileimage)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  const formattedComments = data.map(comment => ({
    id: comment.id,
    post_id: comment.post_id,
    user_id: comment.user_id,
    content: comment.content,
    created_at: comment.created_at,
    user_name: comment.users?.pseudo || "Utilisateur inconnu",
    profile_image: comment.users?.profileimage || "https://via.placeholder.com/150",
  }));

  res.json(formattedComments);
};


// ✅ Ajouter un commentaire
export const addComment = async (req, res) => {
  try {
    const { postId, userId, content } = req.body;
    if (!postId || !userId || !content) {
      return res.status(400).json({ error: "Données manquantes" });
    }

    // 🔹 Ajouter le commentaire
    const { data, error } = await supabase
      .from("comments")
      .insert([{ post_id: postId, user_id: userId, content }])
      .select("*");

    if (error) {
      console.error("🚨 Erreur ajout commentaire :", error.message);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, comment: data[0] });
  } catch (error) {
    console.error("🚨 Erreur serveur :", error.message);
    res.status(500).json({ error: "Erreur serveur lors de l'ajout du commentaire." });
  }
};

// ✅ Ajouter un Like avec `increment()`
export const likePost = async (req, res) => {
  const { postId } = req.params;
  
  if (!postId) {
    console.error("🔴 Erreur : ID du post manquant");
    return res.status(400).json({ error: "ID du post manquant" });
  }

  console.log(`🟢 Tentative d'ajout de like pour le post : ${postId}`);

  try {
    // 🔍 Étape 1 : Vérifier si le post existe
    const { data: existingPost, error: fetchError } = await supabase
      .from("posts")
      .select("likes")
      .eq("id", postId)
      .single();

    if (fetchError || !existingPost) {
      console.error("🔴 Erreur récupération du post :", fetchError?.message);
      return res.status(404).json({ error: "Post non trouvé." });
    }

    console.log("🟢 Post trouvé, nombre actuel de likes :", existingPost.likes);

    // 🔥 Étape 2 : Incrémenter le nombre de likes
    const newLikes = existingPost.likes + 1;

    const { data, error } = await supabase
      .from("posts")
      .update({ likes: newLikes })
      .eq("id", postId)
      .select("id, likes")
      .single();

    if (error) {
      console.error("🔴 Erreur Supabase lors de la mise à jour des likes :", error.message);
      return res.status(500).json({ error: "Erreur serveur lors de l'ajout du like." });
    }

    console.log(`🟢 Like ajouté avec succès : ${data.likes} likes`);

    res.json({ success: true, post: data });

  } catch (error) {
    console.error("🔴 Erreur serveur inattendue :", error.message);
    res.status(500).json({ error: "Erreur serveur lors de l'ajout du like." });
  }
};



