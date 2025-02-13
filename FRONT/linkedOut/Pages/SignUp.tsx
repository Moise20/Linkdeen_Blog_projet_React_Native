import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native"; 
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import Constants from "expo-constants";
import Toast from "react-native-toast-message";

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, "SignUp">;

export const SignUp: React.FunctionComponent = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ firstName: false, lastName: false, pseudo: false, password: false });

  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const BASE_URL = Constants.expoConfig?.extra?.BASE_URL || "https://backend-supabase-peach.vercel.app/api";

  const handleSignUp = async () => {
    let errors = { firstName: !firstName, lastName: !lastName, pseudo: !pseudo, password: !password };
    setFieldErrors(errors);

    if (Object.values(errors).some((err) => err)) {
      Toast.show({ type: "error", text1: "Erreur", text2: "Tous les champs doivent être remplis." });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname: firstName, lastname: lastName, pseudo, password }),
      });

      const data = await response.json();

      if (data.success) {
        Toast.show({ type: "success", text1: "Succès", text2: "Inscription réussie !" });
        navigation.navigate("Login");
      } else {
        Toast.show({ type: "error", text1: "Erreur", text2: data.error });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Erreur", text2: "Impossible de s'inscrire." });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Inscription</Text>

      <TextInput style={[styles.input, fieldErrors.firstName && styles.errorInput]} placeholder="Prénom" placeholderTextColor="#aaa" value={firstName} onChangeText={setFirstName} />
      <TextInput style={[styles.input, fieldErrors.lastName && styles.errorInput]} placeholder="Nom" placeholderTextColor="#aaa" value={lastName} onChangeText={setLastName} />
      <TextInput style={[styles.input, fieldErrors.pseudo && styles.errorInput]} placeholder="Pseudo" placeholderTextColor="#aaa" value={pseudo} onChangeText={setPseudo} autoCapitalize="none" />
      <TextInput style={[styles.input, fieldErrors.password && styles.errorInput]} placeholder="Mot de passe" placeholderTextColor="#aaa" secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// 📌 **Styles**
const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", backgroundColor: "#f5f5f5", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 24, color: "#333" },
  input: { width: "90%", height: 50, borderColor: "#ddd", borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, marginBottom: 16, backgroundColor: "#fff", color: "#333" },
  errorInput: { borderColor: "red", borderWidth: 2 }, 
  button: { width: "90%", height: 50, backgroundColor: "#28a745", borderRadius: 10, justifyContent: "center", alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default SignUp;
