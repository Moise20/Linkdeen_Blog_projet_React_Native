import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { HomeTabs } from "./Pages/HomeTabs";
import Login from "./Pages/Login";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false); // Déconnecte l'utilisateur
  };

  return (
    <NavigationContainer>
      <PaperProvider>
        <View style={styles.container}>
          {isLoggedIn ? (
            <HomeTabs onLogout={handleLogout} />
          ) : (
            <Login setIsLoggedIn={setIsLoggedIn} />
          )}
          <StatusBar style="light" backgroundColor="#6200ee" />
        </View>
      </PaperProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});