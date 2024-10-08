// screens/AccountScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const AccountScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Compte</Text>
      <Button title="Modifier le Profil" onPress={() => { /* Logique pour modifier le profil */ }} />
      <Button title="Déconnexion" onPress={() => { /* Logique de déconnexion */ }} />
      {/* Ajoutez ici d'autres options de gestion de compte */}
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

export default AccountScreen;