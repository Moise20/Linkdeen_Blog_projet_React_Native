import supabase from "../database.js";

// ✅ Récupérer le profil d'un utilisateur
export const getProfile = async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("users")
    .select("firstname, lastname, pseudo, profileimage") // ✅ Utilise "profileimage"
    .eq("id", userId)
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};



// ✅ Mettre à jour un profil
export const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const { firstname, lastname, pseudo, profileimage, currentPassword, newPassword } = req.body;

  let updateData = { firstname, lastname, pseudo };

  if (profileimage) {
    updateData.profileimage = profileimage; // ✅ Correction : profileimage
  }

  if (newPassword) {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("password")
      .eq("id", userId)
      .single();

    if (userError || !user || user.password !== currentPassword) {
      return res.status(401).json({ error: "Mot de passe actuel incorrect" });
    }

    updateData.password = newPassword;
  }

  const { data, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", userId);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true });
};


