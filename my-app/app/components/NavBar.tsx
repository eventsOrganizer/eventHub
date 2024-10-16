import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

interface NavBarProps {
  selectedFilter: string | null;
  setSelectedFilter: (value: string | null) => void;
  onSearch: (searchTerm: string) => void;
}
const NavBar: React.FC<NavBarProps> = ({ selectedFilter, setSelectedFilter, onSearch }) => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <LinearGradient
      colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.navbar}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#fff" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
  placeholder="Search events and services..."
            placeholderTextColor="#ccc"
  value={searchTerm}
  onChangeText={setSearchTerm}
  onSubmitEditing={() => onSearch(searchTerm)}
/>

        </View>
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile' as never)}>
  <Ionicons name="person-outline" size={24} color="#333" />
</TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="notifications" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={(value) => setSelectedFilter(value)}
            items={[
              { label: 'All', value: 'all' },
              { label: 'This Week', value: 'this_week' },
              { label: 'This Month', value: 'this_month' },
            ]}
            style={pickerSelectStyles}
            value={selectedFilter}
            Icon={() => <Ionicons name="chevron-down" size={20} color="#fff" />}
          />
        </View>
      </View>
      
    </LinearGradient>
  );
};

// const handleSearch = (searchTerm: string) => {
//   if (!searchTerm) return; // Ne fait rien si le terme de recherche est vide ou nul
//   const normalizedSearchTerm = searchTerm.toLowerCase();

//   const filteredEvents = events.filter(event => {
//     const title = event.title ? event.title.toLowerCase() : ''; // Vérification si 'event.title' est défini
//     const description = event.description ? event.description.toLowerCase() : ''; // Vérification si 'event.description' est défini
//     return title.includes(normalizedSearchTerm) || description.includes(normalizedSearchTerm);
//   });

//   const filteredServices = services.filter(service => {
//     const name = service.name ? service.name.toLowerCase() : ''; // Vérification si 'service.name' est défini
//     const details = service.details ? service.details.toLowerCase() : ''; // Vérification si 'service.details' est défini
//     return name.includes(normalizedSearchTerm) || details.includes(normalizedSearchTerm);
//   });

//   setEvents(filteredEvents);
//   setServices(filteredServices);
// };

// <TextInput
// style={styles.searchBar}
// placeholder="Search events and services..."
// placeholderTextColor="#ccc"
// value={searchTerm}
// onChangeText={setSearchTerm}
// onSubmitEditing={() => onSearch(searchTerm)}
// />


const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchBar: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 8,
  },
  iconContainer: {
    marginHorizontal: 10,
    padding: 5,
  },
  pickerContainer: {
    width: 120,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'white',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'white',
    paddingRight: 30,
  },
});

export default NavBar;
