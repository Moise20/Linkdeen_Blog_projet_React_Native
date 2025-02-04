import supabase from "../database.js";

// ✅ Inscription utilisateur avec PSEUDO et MDP seulement
export const signUp = async (req, res) => {

  const { firstname, lastname, pseudo, password } = req.body;

  if (!firstname || !lastname || !pseudo || !password) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  // 🔹 Vérifie si le pseudo existe déjà
  const { data: existingUser, error: pseudoCheckError } = await supabase
    .from("users")
    .select("id")
    .eq("pseudo", pseudo)
    .single();

  if (existingUser) {
    return res.status(400).json({ error: "Ce pseudo est déjà utilisé." });
  }

  // 🔹 Hash du mot de passe
  const bcrypt = await import("bcrypt");
  const hashedPassword = await bcrypt.hash(password, 10);

  // 🔹 Insérer l'utilisateur
  const { data, error } = await supabase
    .from("users")
    .insert([{ firstname, lastname, pseudo, password: hashedPassword }])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true, user: data[0] });
};



// ✅ Connexion utilisateur avec PSEUDO uniquement
export const login = async (req, res) => {
  const { pseudo, password } = req.body;

  if (!pseudo || !password) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  // 🔹 Récupérer l'utilisateur
  const { data: user, error } = await supabase
    .from("users")
    .select("id, password, firstname, lastname, pseudo")
    .eq("pseudo", pseudo)
    .single();

  if (error || !user) {
    return res.status(401).json({ error: "Pseudo ou mot de passe incorrect." });
  }

  // 🔹 Vérifier le mot de passe
  const bcrypt = await import("bcrypt");
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ error: "Pseudo ou mot de passe incorrect." });
  }

  res.json({ success: true, user: { id: user.id, firstname: user.firstname, lastname: user.lastname, pseudo: user.pseudo } });
};

