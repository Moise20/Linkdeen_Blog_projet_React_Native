import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// ✅ Charge les variables d'environnement
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

console.log("🔍 SUPABASE_URL :", SUPABASE_URL ? "OK" : "❌ Manquant !");
console.log("🔍 SUPABASE_KEY :", SUPABASE_KEY ? "OK" : "❌ Manquant !");

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("❌ Supabase URL et clé API manquantes !");
}

// ✅ Connexion à Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🔥 Test de connexion
async function testConnection() {
  const { data, error } = await supabase.from("posts").select("*").limit(1);
  if (error) {
    console.error("🚨 Erreur connexion Supabase :", error.message);
  } else {
    console.log("✅ Connexion Supabase OK, Post récupéré :", data);
  }
}

testConnection();

export default supabase;
