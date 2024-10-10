// screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/standardComponents/customButton';
import RNPickerSelect from 'react-native-picker-select';
import Section from '../components/standardComponents/sections';
import { supabase } from '../services/supabaseClient';
import { useNavigation } from '@react-navigation/native';

const HomeScreen: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [topEvents, setTopEvents] = useState<any[]>([]);
  const [staffServices, setStaffServices] = useState<any[]>([]);
  const [localServices, setLocalServices] = useState<any[]>([]);
  const [materialsAndFoodServices, setMaterialsAndFoodServices] = useState<any[]>([]);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const { data: eventsData, error: eventsError } = await supabase
        .from('event')
        .select('*');
      if (eventsError) console.error(eventsError);
      else setEvents(eventsData);

      const { data: staffServicesData, error: staffServicesError } = await supabase
        .from('personal')
        .select('*');
      if (staffServicesError) console.error(staffServicesError);
      else setStaffServices(staffServicesData);

      const { data: localServicesData, error: localServicesError } = await supabase
        .from('local')
        .select('*');
      if (localServicesError) console.error(localServicesError);
      else setLocalServices(localServicesData);

      const { data: materialsAndFoodServicesData, error: materialsAndFoodServicesError } = await supabase
        .from('material')
        .select('*');
      if (materialsAndFoodServicesError) console.error(materialsAndFoodServicesError);
      else setMaterialsAndFoodServices(materialsAndFoodServicesData);
    };

    fetchData();
  }, []);

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
        <Section data={events.map(event => ({
          title: event.name,
          description: event.details || '',
          imageUrl: '' // Ajoutez une URL d'image si disponible
        }))} style={styles.section} title="" />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top staff services</Text>
          <CustomButton title="See all" onPress={() => navigation.navigate('Personals')}  />
        </View>
        <Section data={staffServices.map(service => ({
          title: service.name,
          description: service.details || '',
          imageUrl: '' // Ajoutez une URL d'image si disponible
        }))} style={styles.section} title="" />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top locals services</Text>
          <CustomButton title="See all" onPress={() => { console.log('Bouton pressé') }} />
        </View>
        <Section data={localServices.map(service => ({
          title: service.name,
          description: '',
          imageUrl: '' // Ajoutez une URL d'image si disponible
        }))} style={styles.section} title="" />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top materials and food services</Text>
          <CustomButton title="See all" onPress={() => { console.log('Bouton pressé') }} />
        </View>
        <Section data={materialsAndFoodServices.map(service => ({
          title: service.name,
          description: service.details || '',
          imageUrl: '' // Ajoutez une URL d'image si disponible
        }))} style={styles.section} title="" />
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