// screens/EventsScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';

const EventsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Événements</Text>
      <Button title="Créer un Événement" onPress={() => { /* Logique de création d'événement */ }} />
      <Text>Liste des événements disponibles :</Text>
      {/* Display an image instead of category and subcategory names */}
      <Image source={require('../../../my-app/app/assets/im.png')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 100, // Set the width of the image
    height: 100, // Set the height of the image
    marginTop: 20, // Add some margin to separate from other elements
  },
});

export default EventsScreen;