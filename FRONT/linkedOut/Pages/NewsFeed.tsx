// NewsFeed.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const NewsFeed = () => {
  return (
    <View style={styles.container}>
      <Text>Bienvenue sur le Fil d'actualité !</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
});

export default NewsFeed;