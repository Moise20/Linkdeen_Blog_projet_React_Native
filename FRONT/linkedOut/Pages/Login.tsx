import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import Toast from "react-native-toast-message";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">;

export const Login: React.FunctionComponent<{ setIsLoggedIn: (isLoggedIn: boolean) => void }> = ({ setIsLoggedIn }) => {
  const [pseudo, setPseudo] = useState(""); 
  const [password, setPassword] = useState("");
  const [pseudoError, setPseudoError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const BASE_URL = Constants.expoConfig?.extra?.BASE_URL || "https://backend-supabase-peach.vercel.app/api";

  const handleLogin = async () => {
    setPseudoError(false);
    setPasswordError(false);

    if (!pseudo || !password) {
      if (!pseudo) setPseudoError(true);
      if (!password) setPasswordError(true);
      Toast.show({ type: "error", text1: "Erreur", text2: "Veuillez remplir tous les champs." });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo, password }),
      });

      const data = await response.json();

      if (data.success) {
        Toast.show({ type: "success", text1: "Succès", text2: "Connexion réussie !" });
        await AsyncStorage.setItem("user_id", data.user.id.toString());
        setIsLoggedIn(true);
      } else {
        setPseudoError(true);
        setPasswordError(true);
        Toast.show({ type: "error", text1: "Erreur", text2: data.error });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Erreur", text2: "Impossible de se connecter." });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      <TextInput
        style={[styles.input, pseudoError && styles.errorInput]}
        placeholder="Pseudo"
        placeholderTextColor="#aaa"
        value={pseudo}
        onChangeText={setPseudo}
        autoCapitalize="none"
      />

      <TextInput
        style={[styles.input, passwordError && styles.errorInput]}
        placeholder="Mot de passe"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.signUpText}>Pas de compte ? Inscris-toi !</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// 📌 **Styles modernisés**
const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 24, color: "#333" },
  input: { width: "90%", height: 50, borderColor: "#ddd", borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, marginBottom: 16, backgroundColor: "#fff", color: "#333" },
  errorInput: { borderColor: "red", borderWidth: 2 }, // 🔥 **Ajout du style rouge si erreur**
  button: { width: "90%", height: 50, backgroundColor: "#007bff", borderRadius: 10, justifyContent: "center", alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  signUpText: { marginTop: 20, color: "#007bff", fontSize: 16, fontWeight: "bold" },
});

export default Login;
