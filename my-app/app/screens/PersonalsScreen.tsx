import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PersonalScreenNavigationProp } from '../navigation/types';
import { fetchStaffServices, Service } from '../services/personalService';
import CategoryList from '../components/standardComponents/CategoryList';
import ServiceGrid from '../components/standardComponents/ServiceGrid';

const PersonalsScreen: React.FC = () => {
  const [staffServices, setStaffServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigation = useNavigation<PersonalScreenNavigationProp>();

  useEffect(() => {
    const loadServices = async () => {
      const services = await fetchStaffServices();
      setStaffServices(services);
    };
    loadServices();
  }, []);

  const filteredServices = selectedCategory
    ? staffServices.filter(service => service.subcategory?.name === selectedCategory)
    : staffServices;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>N</Text>
        <Ionicons name="cart-outline" size={24} color="black" />
      </View>
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="gray" style={styles.searchIcon} />
        <Text style={styles.searchText}>Search staff services</Text>
      </View>
      <CategoryList selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      <ServiceGrid services={filteredServices} navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    margin: 10,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchText: {
    flex: 1,
    paddingVertical: 8,
    color: 'gray',
  },
});

export default PersonalsScreen;