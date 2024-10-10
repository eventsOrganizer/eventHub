// screens/EventsScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const EventsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Événements</Text>
      <Button title="Créer un Événement" onPress={() => { /* Logique de création d'événement */ }} />
      <Text>Liste des événements disponibles :</Text>
      {/* Ajoutez ici la logique pour afficher la liste des événements */}
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
});

export default EventsScreen;

