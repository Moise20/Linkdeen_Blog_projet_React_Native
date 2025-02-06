import supabase from "../database.js";

// ✅ Récupérer tous les utilisateurs
export const getAllUsers = async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, firstname, lastname, pseudo, profileimage"); // Sélectionner les colonnes nécessaires

  if (error) return res.status(500).json({ error: error.message });

  res.json({ users: data });
};
