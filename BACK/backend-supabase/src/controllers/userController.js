import supabase from "../database.js";

export const getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, firstname, lastname, pseudo, profileimage");

    if (error) {
      console.error("🚨 Erreur PostgreSQL :", error.message);
      return res.status(500).json({ error: error.message });
    }

    res.json({ users: data });
  } catch (error) {
    console.error("🚨 Erreur serveur :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
