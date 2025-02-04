import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">;

export const Login: React.FunctionComponent<{ 
  setIsLoggedIn: (isLoggedIn: boolean) => void; 
}> = ({ setIsLoggedIn }) => {
  const [pseudo, setPseudo] = useState(""); 
  const [password, setPassword] = useState("");
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // ✅ Récupérer l'URL de Vercel depuis .env
  const BASE_URL = Constants.expoConfig?.extra?.BASE_URL || "https://backend-supabase-peach.vercel.app/api";

  const handleLogin = async () => {
    if (!pseudo || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    try {
      console.log("🔹 Envoi des données :", { pseudo, password });

      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo, password }),
      });

      const data = await response.json();
      console.log("🔹 Réponse du serveur :", data); 

      if (data.success) {
        Alert.alert("Succès", "Connexion réussie !");
        
        // 🔹 Stocker user_id en local pour une connexion persistante
        await AsyncStorage.setItem("user_id", data.user.id.toString());
        
        setIsLoggedIn(true);
      } else {
        Alert.alert("Erreur", data.error);
      }
    } catch (error) {
      console.error("🚨 Erreur de connexion :", error);
      Alert.alert("Erreur", "Impossible de se connecter au serveur.");
    }
  };
  const goToSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      <TextInput
        style={styles.input}
        placeholder="Pseudo"
        placeholderTextColor="#aaa"
        value={pseudo}
        onChangeText={setPseudo}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToSignUp}>
        <Text style={styles.signUpText}>Pas de compte ? Inscris-toi !</Text>
      </TouchableOpacity>
    </View>
  );
};

// ✅ Ajout du style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpText: {
    marginTop: 20,
    color: "#007bff",
    fontSize: 16,
  },
});

export default Login;
