// screens/HomeScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/standardComponents/customButton';
import RNPickerSelect from 'react-native-picker-select';
import Section from '../components/standardComponents/sections';

const HomeScreen: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const fakeEvents = [
    { title: 'Concert Rock', description: 'Le meilleur concert de rock en ville.', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvAW5v6Q9egn_GJXVu9m7cVxDaLD_tYTz31g&s' },
    { title: 'Atelier Cuisine', description: 'Apprenez à cuisiner des plats délicieux.', imageUrl: 'https://teambooking.fr/wp-content/uploads/2024/01/atelier-cuisine-team-building-lyon-renforcement-equipe-1-1.webp' },
    { title: 'Marathon', description: 'Participez à notre marathon annuel.', imageUrl: 'https://marathon.comar.tn/sites/default/files/inline-images/Sans%20titre%20%281%29.jpg' },
    { title: 'Exposition d\'Art', description: 'Découvrez des œuvres d\'artistes locaux.', imageUrl: 'https://image.over-blog.com/waCkrPis1VFIr-JBruEH0-FHftc=/filters:no_upscale()/image%2F1406669%2F20240807%2Fob_ffac14_expo-art-urbain-petit-palais-paris.jpg' },
  ];

  const fakeTopEvents = [
    { title: 'Festival Jazz', description: 'Un festival de jazz incroyable.', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQL0sjzO4rPJdKL7OIzT0Fm8JOXQfmyLF5DA&s' },
    { title: 'Conférence Tech', description: 'Les dernières innovations technologiques.', imageUrl: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/technology-conference-post-design-template-7b35dcccfd217515239991c14bd9dff5_screen.jpg?ts=1663081102' },
    { title: 'Salon du Livre', description: 'Rencontrez vos auteurs préférés.', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkoQbkQUPGwwqZo8EIJAzBtKS4JABd5j1RmA&s' },
    { title: 'Spectacle de Magie', description: 'Un spectacle de magie pour toute la famille.', imageUrl: 'https://i0.wp.com/alex-magicien.fr/wp-content/uploads/2015/05/Affiche-spectacle-de-magie-Alex-le-magicien-774x1024.jpg?ssl=1' },
  ];

  const fakeProducts = [
    { title: 'Guitare Électrique', description: 'Guitare de haute qualité à vendre.', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlaPVJzESG50tMzpaKUhxQyGRHcG0yPaDaPw&s' },
    { title: 'Appareil Photo', description: 'Appareil photo professionnel.', imageUrl: 'https://media.s-bol.com/3G2PPwYJWBEp/lJQB27/550x454.jpg' },
    { title: 'Vélo de Montagne', description: 'Vélo robuste pour les terrains difficiles.', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtFqz1V0as--Bn_URHTbSHKAntEquVKJELKA&s' },
    { title: 'Ordinateur Portable', description: 'Ordinateur portable performant.', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8YJN4T0TxETPJYqskAqFrnEA9i5NBvvERvutOAWAsDtynxxSsQRpPlUW40HuDgo8lslw&usqp=CAU' },
  ];

  const fakeRentals = [
    { title: 'Projecteur', description: 'Projecteur HD à louer.', imageUrl: 'https://masterled.es/8678-large_zoom/projecteur-led-100w-plat-smd.jpg' },
    { title: 'Tente de Camping', description: 'Tente spacieuse pour vos aventures.', imageUrl: 'https://www.toitdecoton.fr/wp-content/uploads/2022/07/sibley-800-protech.jpg' },
    { title: 'Voiture de Luxe', description: 'Louez une voiture de luxe pour vos événements.', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjH_P-CUZVR8Z_sZ_nzxAxtJE1NSXzSNkc_g&s' },
    { title: 'Salle de Réunion', description: 'Salle équipée pour vos réunions professionnelles.', imageUrl: 'https://intense-dmc.com/wp-content/themes/yootheme/cache/1b/salle-reunion-seminaire-1-1b5a72f9.jpeg' },
  ];

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TextInput
          style={styles.searchBar}
          placeholder="Rechercher des événements..."
        />
        <Ionicons name="notifications-outline" size={24} style={styles.icon} />
        <RNPickerSelect
          onValueChange={(value) => setSelectedFilter(value)}
          items={[
            { label: 'Tous', value: 'all' },
            { label: 'Événements', value: 'events' },
            { label: 'Produits', value: 'products' },
            { label: 'Services', value: 'services' },
          ]}
          style={pickerSelectStyles}
          placeholder={{ label: "Filtre Avancé", value: null }}
        />
      </View>

      {/* Services Icons */}
      <View style={styles.services}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Ionicons name="musical-notes-outline" size={40} style={styles.serviceIcon} />
          <Ionicons name="restaurant-outline" size={40} style={styles.serviceIcon} />
          <Ionicons name="camera-outline" size={40} style={styles.serviceIcon} />
        </ScrollView>
      </View>

      {/* Sections */}
      <ScrollView style={styles.sections}>
        <Section title="Your events" data={fakeEvents} />
        <Section title="Top events" data={fakeTopEvents} />
        <Section title="Top products to sell" data={fakeProducts} />
        <Section title="Top  rent" data={fakeRentals} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  icon: {
    marginHorizontal: 5,
  },
  services: {
    marginBottom: 20,
  },
  serviceIcon: {
    marginHorizontal: 10,
    color: '#4CAF50',
  },
  sections: {
    flex: 1,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default HomeScreen;