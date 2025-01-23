import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export const Login: React.FunctionComponent<{ 
  setIsLoggedIn: (isLoggedIn: boolean) => void 
}> = ({ setIsLoggedIn }) => {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    if (!pseudo || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    try {
      // Vérifier si le pseudo et le mot de passe correspondent
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("pseudo", "==", pseudo), where("password", "==", password));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Erreur", "Pseudo ou mot de passe incorrect.");
        return;
      }

      // Connexion réussie
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la connexion.");
    }
  };

  const goToSignUp = () => {
    navigation.navigate('SignUp');
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
    color: '#007bff',
    fontSize: 16,
  },
});

export default Login;
