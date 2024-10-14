import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PersonalScreenNavigationProp } from '../../navigation/types';
import { Service } from '../../services/serviceTypes';
import { fetchStaffServices } from '../../services/personalService';
import CategoryList from '../../components/PersonalServiceComponents/CategoryList';

const PersonalsScreen = () => {
  const [staffServices, setStaffServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const navigation = useNavigation<PersonalScreenNavigationProp>();
  const route = useRoute();
  const { category }: { category?: string } = route.params || {};

  const loadServices = useCallback(async () => {
    try {
      const services = await fetchStaffServices();
      setStaffServices(services);
    } catch (error) {
      console.error('Error loading services:', error);
      setStaffServices([]);
    }
  }, []);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
    loadServices();
  }, [category, loadServices]);

  const filteredServices = staffServices.filter(service => 
    (selectedCategory ? service.subcategory?.name === selectedCategory : true) &&
    (searchQuery ? service.name.toLowerCase().includes(searchQuery.toLowerCase()) : true) &&
    (minPrice ? service.priceperhour >= parseFloat(minPrice) : true) &&
    (maxPrice ? service.priceperhour <= parseFloat(maxPrice) : true)
  );

  const renderServiceItem = ({ item }: { item: Service }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => navigation.navigate('PersonalDetail', { personalId: item.id })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.serviceImage} />
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.servicePrice}>${item.priceperhour}/hr</Text>
        <Text style={styles.serviceDetails}>{item.details}</Text>
        <View style={styles.serviceStats}>
          <Text style={styles.serviceLikes}>❤️ {item.like?.length || 0}</Text>
          <Text style={styles.serviceReviews}>⭐ {item.review?.length || 0}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search staff services"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <View style={styles.priceFilter}>
        <TextInput
          style={styles.priceInput}
          placeholder="Min price"
          value={minPrice}
          onChangeText={setMinPrice}
          keyboardType="numeric"
        />
        <Text style={styles.priceSeparator}>-</Text>
        <TextInput
          style={styles.priceInput}
          placeholder="Max price"
          value={maxPrice}
          onChangeText={setMaxPrice}
          keyboardType="numeric"
        />
      </View>
      <CategoryList selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      <FlatList
        data={filteredServices}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.serviceList}
        contentContainerStyle={styles.serviceListContent}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 10,
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    paddingVertical: 10,
    color: 'black',
  },
  priceFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  priceSeparator: {
    marginHorizontal: 10,
  },
  serviceList: {
    flex: 1,
  },
  serviceListContent: {
    padding: 10,
  },
  serviceItem: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  serviceInfo: {
    padding: 15,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  servicePrice: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 5,
  },
  serviceDetails: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 10,
  },
  serviceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceLikes: {
    fontSize: 14,
    color: '#E91E63',
  },
  serviceReviews: {
    fontSize: 14,
    color: '#FFC107',
  },
});
export default PersonalsScreen;

