import supabase from "../database.js";

// ✅ Récupérer tous les utilisateurs
export const getUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("id, pseudo, profileimage")
      .order("pseudo", { ascending: true });

    if (error) {
      console.error("🚨 Erreur lors de la récupération des utilisateurs :", error.message);
      return res.status(500).json({ error: error.message });
    }

    res.json(users);
  } catch (error) {
    console.error("🚨 Erreur serveur :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ✅ Récupérer les messages entre deux utilisateurs
export const getMessages = async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id; // Supposons que l'ID de l'utilisateur actuel est disponible dans req.user

  try {
    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("🚨 Erreur lors de la récupération des messages :", error.message);
      return res.status(500).json({ error: error.message });
    }

    res.json(messages);
  } catch (error) {
    console.error("🚨 Erreur serveur :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ✅ Envoyer un message
export const sendMessage = async (req, res) => {
  const { senderId, receiverId, content } = req.body;

  try {
    const { data, error } = await supabase
      .from("messages")
      .insert([{ sender_id: senderId, receiver_id: receiverId, content }])
      .select("*");

    if (error) {
      console.error("🚨 Erreur lors de l'envoi du message :", error.message);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, message: data[0] });
  } catch (error) {
    console.error("🚨 Erreur serveur :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};