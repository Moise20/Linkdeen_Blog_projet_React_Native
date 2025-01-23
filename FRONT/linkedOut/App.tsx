import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { HomeTabs } from "./Pages/HomeTabs";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import { navigationRef } from './RootNavigation';
import { RootStackParamList } from './types';
import './firebase.js';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false); // Déconnecte l'utilisateur
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <PaperProvider>
        <View style={styles.container}>
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
                <Stack.Screen 
                  name="SignUp" 
                  component={SignUp} 
                />
              </>
            )}
          </Stack.Navigator>
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
