import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes.js";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 Permettre l'accès aux fichiers statiques (images uploadées)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api", router);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));
