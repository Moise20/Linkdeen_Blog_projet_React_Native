import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { HomeTabs } from "./Pages/HomeTabs";
import SignUp from "./Pages/SignUp";
import { navigationRef } from "./RootNavigation";
import { RootStackParamList } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Login } from "./Pages/Login";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // ✅ Gérer le splash screen

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userId = await AsyncStorage.getItem("user_id");
      setIsLoggedIn(!!userId);
    };
    checkLoginStatus();

    // ✅ Vérification des permissions seulement si pas encore accordées
    const requestPermissions = async () => {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (newStatus !== "granted") {
          Alert.alert(
            "Permission requise",
            "Nous avons besoin d'accéder à votre galerie pour sélectionner une image."
          );
        }
      }
    };
    requestPermissions();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user_id");
    setIsLoggedIn(false);
  };

  if (isLoggedIn === null) {
    return (
      <View style={styles.splashScreen}>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isLoggedIn ? (
              <Stack.Screen
                name="HomeTabs"
                children={() => <HomeTabs onLogout={handleLogout} />}
              />
            ) : (
              <>
                <Stack.Screen
                  name="Login"
                  children={() => <Login setIsLoggedIn={setIsLoggedIn} />}
                />
                <Stack.Screen name="SignUp" component={SignUp} />
              </>
            )}
          </Stack.Navigator>
          <StatusBar style="light" backgroundColor="#6200ee" />
        </SafeAreaView>
      </PaperProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6200ee", // ✅ Fond de couleur cohérent avec l'application
  },
});

