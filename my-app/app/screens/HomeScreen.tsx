// screens/HomeScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, ScrollView, StyleSheet, Text } from 'react-native';
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

  const fakeStaffServices = [
    { title: 'DJ Professionnel', description: 'DJ pour animer vos soirées.', imageUrl: 'https://example.com/dj.jpg' },
    { title: 'Photographe', description: 'Photographe pour capturer vos moments.', imageUrl: 'https://example.com/photographer.jpg' },
    // Ajoutez d'autres services ici
  ];

  const fakeLocalServices = [
    { title: 'Salle de Fête', description: 'Location de salle pour vos événements.', imageUrl: 'https://example.com/venue.jpg' },
    { title: 'Traiteur', description: 'Service de traiteur pour vos réceptions.', imageUrl: 'https://example.com/catering.jpg' },
    // Ajoutez d'autres services ici
  ];

  const fakeMaterialsAndFoodServices = [
    { title: 'Matériel de Sonorisation', description: 'Location de matériel audio.', imageUrl: 'https://example.com/sound.jpg' },
    { title: 'Buffet', description: 'Buffet varié pour vos événements.', imageUrl: 'https://example.com/buffet.jpg' },
    // Ajoutez d'autres services ici
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
      <ScrollView style={styles.sections} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your events</Text>
          <CustomButton title="See all" onPress={() => { console.log('Bouton pressé') }} />
        </View>
        <Section data={fakeEvents} style={styles.section}  title=""/>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top events</Text>
          <CustomButton title="See all" onPress={() => { console.log('Bouton pressé') }} />
        </View>
        <Section data={fakeTopEvents} style={styles.section} title="" />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top staff services</Text>
          <CustomButton title="See all" onPress={() => { console.log('Bouton pressé') }} />
        </View>
        <Section data={fakeStaffServices} style={styles.section} title="" />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top locals services</Text>
          <CustomButton title="See all" onPress={() => { console.log('Bouton pressé') }} />
        </View>
        <Section data={fakeLocalServices} style={styles.section} title="" />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top materials and food services</Text>
          <CustomButton title="See all" onPress={() => { console.log('Bouton pressé') }} />
        </View>
        <Section data={fakeMaterialsAndFoodServices} style={styles.section} title="" />
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
  scrollViewContent: {
    paddingBottom: 20, // Ajoutez un padding en bas pour éviter que le dernier élément soit coupé
  },
  section: {
    marginBottom: 20, // Ajoutez un margin en bas de chaque section
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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