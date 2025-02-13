import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes.js"; // 📌 Assure-toi que les routes sont bien importées

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", router);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});

// 📌 IMPORTANT : Exporter `app` pour que Vercel le reconnaisse
export default app;
