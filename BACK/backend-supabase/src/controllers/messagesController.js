import supabase from "../database.js";

// ✅ Récupérer tous les messages d'un utilisateur
export const getMessagesByUser = async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("messages")
    .select("id, sender, content, user_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ messages: data });
};

// ✅ Créer un nouveau message
export const createMessage = async (req, res) => {
  const { sender, content, user_id } = req.body; // Récupérer les données du message envoyé dans le corps de la requête

  if (!sender || !content || !user_id) {
    return res.status(400).json({ error: "Sender, content and user_id are required" });
  }

  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        sender,
        content,
        user_id,
      },
    ])
    .single(); // `.single()` pour insérer un seul message et récupérer l'objet inséré

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ message: data });
};

// ✅ Supprimer un message par son ID
export const deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  const { data, error } = await supabase
    .from("messages")
    .delete()
    .eq("id", messageId)
    .single(); // `.single()` pour retourner un seul objet supprimé

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ message: "Message deleted successfully", data });
};

// ✅ Modifier un message par son ID
export const updateMessage = async (req, res) => {
  const { messageId } = req.params;
  const { sender, content } = req.body; // Récupérer les nouvelles données du message

  if (!sender || !content) {
    return res.status(400).json({ error: "Sender and content are required" });
  }

  const { data, error } = await supabase
    .from("messages")
    .update({
      sender,
      content,
    })
    .eq("id", messageId)
    .single(); // `.single()` pour retourner un seul objet mis à jour

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ message: "Message updated successfully", data });
};
