// screens/ServicesScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ServicesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Services</Text>
      <Button title="Offrir un Service" onPress={() => { /* Logique pour offrir un service */ }} />
      <Text>Liste des services disponibles :</Text>
      {/* Ajoutez ici la logique pour afficher la liste des services */}
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

export default ServicesScreen;