📜 README - Frontend (React Native + Expo)
🚀 LinkedOut - Frontend en React Native avec Expo
📌 Instructions pour installer et utiliser l'application mobile.

📥 Installation

cd frontend-linkedout

2️⃣ Installer les dépendances

npm install

3️⃣ Configurer l'URL du backend
Dans app.json ou app.config.js, ajoute l'URL de l'API :

{
  "expo": {
    "extra": {
      "BASE_URL": "https://backend-supabase-peach.vercel.app/api"
    }
  }
}
et 
Dans .env, ajoute l'URL de l'API :


BASE_URL=https://backend-supabase-peach.vercel.app/api

Si .env n'existe pas, crée-le à la racine du projet.

4️⃣ Installer React Native CLI (si ce n'est pas encore fait)

npm install -g react-native-cli


🚀 Lancer l'application
✅ Avec Expo :


npx expo start
📱 Scanne le QR code avec l'application Expo Go sur ton téléphone OU lance un émulateur Android/iOS.

🛠 Fonctionnalités
✔ Connexion & Inscription 🔐
✔ Publier un post (texte & image) 📝🖼
✔ Voir et commenter les publications 💬
✔ Mettre à jour son profil 👤
✔ Déconnexion 🔑

🎯 C'est prêt ! 🚀
💡 Pas besoin de modifier l'API, elle est déjà connectée !
Lance Expo et commence à utiliser l'application. 🎉