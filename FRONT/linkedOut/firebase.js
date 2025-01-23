import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCExJXV8Dhuyj4GweuUcjHFyR17sfRsIng",
  authDomain: "linkedout-715ef.firebaseapp.com",
  projectId: "linkedout-715ef",
  storageBucket: "linkedout-715ef.appspot.com", // Correction de l'URL du bucket
  messagingSenderId: "1054506927868",
  appId: "1:1054506927868:web:fa85f842c147a0cc4cb979",
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Initialisation des services Firebase
export const db = getFirestore(app); // Pour Firestore
export const auth = getAuth(app);    // Pour l'authentification

export default app;
