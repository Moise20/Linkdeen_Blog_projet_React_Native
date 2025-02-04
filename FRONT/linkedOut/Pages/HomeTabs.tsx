import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
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
    <View style={styles.safeArea}>
      {/* ✅ Barre d'en-tête avec le menu */}
      <Appbar.Header style={styles.appBar}>
        <Appbar.Content title="LinkedOut" />
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action icon="dots-vertical" onPress={openMenu} />
          }
        >
          <Menu.Item
            onPress={() => {
              closeMenu();
              onLogout(); // ✅ Déconnexion
            }}
            title="Se déconnecter"
            leadingIcon="logout"
          />
        </Menu>
      </Appbar.Header>

      {/* ✅ Navigation par onglets */}
      <Tab.Navigator
        screenOptions={{
          headerShown: false, 
          tabBarActiveTintColor: "#007bff",
          tabBarInactiveTintColor: 'white',
          tabBarStyle: styles.tabBar,
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
    </View>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Fond général
  },
  appBar: {
    marginTop: -60,
  },
  tabBar: {
    backgroundColor: "#233868", // ✅ Couleur de la barre des onglets
  },
});

export default HomeTabs;
