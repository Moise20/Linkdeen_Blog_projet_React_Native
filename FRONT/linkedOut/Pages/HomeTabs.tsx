import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Appbar } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Messages from "./Messages1";
import Notifications from "./Notifications";
import CreatePostModal from "./CreatePostScreen";
import { NewsFeed } from "./NewsFeed";
import { Profiles } from "./Profiles";

const Tab = createBottomTabNavigator();

export const HomeTabs = ({ onLogout }: { onLogout: () => void }) => {
  const [title, setTitle] = useState("Fil d'actualité");
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);

  return (
    <View style={styles.safeArea}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.Content title={title} />
        <Appbar.Action icon="plus" onPress={() => setIsPostModalVisible(true)} />
      </Appbar.Header>

      {/* ✅ Modal d'ajout de post */}
      <CreatePostModal visible={isPostModalVisible} onClose={() => setIsPostModalVisible(false)} onPost={() => {}} />

      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#007bff",
          tabBarInactiveTintColor: "white",
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Home") iconName = "newspaper-variant-outline";
            else if (route.name === "Messages") iconName = "message-text-outline";
            else if (route.name === "Notifications") iconName = "bell-outline";
            else if (route.name === "Profile") iconName = "account";
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        screenListeners={{
          state: (e) => {
            const routeName = e.data.state.routes[e.data.state.index].name;
            setTitle(
              routeName === "Home" ? "Fil d'actualité" :
              routeName === "Messages" ? "Chat" :
              routeName === "Notifications" ? "Notifications" :
              "Profil"
            );
          },
        }}
      >
        <Tab.Screen name="Home" component={NewsFeed} />
        <Tab.Screen name="Messages" component={Messages} />
        <Tab.Screen name="Notifications" component={Notifications} />
        <Tab.Screen 
          name="Profile" 
          children={() => <Profiles onLogout={onLogout} />}  // ✅ Passer `onLogout`
        />
      </Tab.Navigator>
    </View>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  appBar: { backgroundColor: "white", elevation: 3 },
  tabBar: { backgroundColor: "#233868" },
});

export default HomeTabs;
