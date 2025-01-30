import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // ✅ Import de la navigation
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, "SignUp">;

export const SignUp: React.FunctionComponent = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(""); // ✅ Ajout du champ email
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<SignUpScreenNavigationProp>(); // ✅ Déclaration de navigation

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !pseudo || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }
  
    console.log("🔹 Envoi des données :", { firstName, lastName, email, pseudo, password });
  
    try {
      const response = await fetch("http://10.7.131.3:1234/signup.php", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          firstName, 
          lastName, 
          email, 
          pseudo, 
          password 
        }),
      });
  
      const data = await response.json();
      console.log("🔹 Réponse du serveur :", data); // 🔥 Voir ce que le serveur retourne
  
      if (data.success) {
        Alert.alert("Succès", "Inscription réussie !");
        navigation.navigate("Login");
      } else {
        Alert.alert("Erreur", data.error);
      }
    } catch (error) {
      console.error("🚨 Erreur d'inscription :", error);
      Alert.alert("Erreur", "Impossible de se connecter au serveur.");
    }
  };
  
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>

      <TextInput
        style={styles.input}
        placeholder="Prénom"
        placeholderTextColor="#aaa"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Nom"
        placeholderTextColor="#aaa"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

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

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
};

// ✅ Ajout du style mis à jour
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
    backgroundColor: "#28a745",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignUp;
