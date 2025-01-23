import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NewsFeed from './NewsFeed';
import Profiles from './Profiles';
import { Appbar, Menu } from 'react-native-paper'; // Import pour le menu
import { Colors } from 'react-native/Libraries/NewAppScreen';

const Tab = createBottomTabNavigator();

export const HomeTabs = ({ onLogout }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  // Gérer l'ouverture et la fermeture du menu
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <>
      {/* Barre d'en-tête avec le bouton de déconnexion */}
      <Appbar.Header>
        <Appbar.Content title="LinkedOut" />
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action
              icon="dots-vertical"
              color="black"
              onPress={openMenu} // Ouvre le menu
            />
          }
        >
          {/* Option de déconnexion */}
          <Menu.Item
            onPress={() => {
              closeMenu();
              onLogout(); // Appelle la fonction de déconnexion passée en prop
            }}
            title="Se déconnecter"
            leadingIcon="logout"
          />
        </Menu>
      </Appbar.Header>

      {/* Navigation par onglets */}
      <Tab.Navigator
        screenOptions={{
          headerShown: false, // Désactive les en-têtes automatiques
          tabBarActiveTintColor: Colors.tintColor, // Couleur des icônes actives
          tabBarInactiveTintColor: 'gray', // Couleur des icônes inactives
        }}
      >
        <Tab.Screen
          name="Home"
          component={NewsFeed}
          options={{
            tabBarLabel: 'Fil d\'actualité',
            tabBarIcon: ({ color, size }) => (
              <Icon name="newspaper-variant-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profiles}
          options={{
            tabBarLabel: 'Profil',
            tabBarIcon: ({ color, size }) => (
              <Icon name="account" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};