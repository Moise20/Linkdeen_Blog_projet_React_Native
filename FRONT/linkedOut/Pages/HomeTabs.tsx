import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NewsFeed from './NewsFeed';
import Profiles from './Profiles';
import { Appbar, Menu } from 'react-native-paper';

const Tab = createBottomTabNavigator();

export const HomeTabs = ({ onLogout }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  // Gérer l'ouverture et la fermeture du menu
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="LinkedOut" />
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action
              icon="dots-vertical"
              color="black"
              onPress={openMenu}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              closeMenu();
              onLogout(); // Déconnexion
            }}
            title="Se déconnecter"
            leadingIcon="logout"
          />
        </Menu>
      </Appbar.Header>

      <Tab.Navigator
        screenOptions={{
          headerShown: false, 
          tabBarActiveTintColor: "blue",
          tabBarInactiveTintColor: 'gray',
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
