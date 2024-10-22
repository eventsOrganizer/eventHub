import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PersonalScreenNavigationProp } from '../../navigation/types';
import { Service } from '../../services/serviceTypes';
import { fetchStaffServices } from '../../services/personalService';
import CategoryList from '../../components/PersonalServiceComponents/CategoryList';
import ServiceItem from './ServiceItem';
import { styles } from './styles';

const PersonalsScreen: React.FC = () => {
  const [staffServices, setStaffServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const navigation = useNavigation<PersonalScreenNavigationProp>();
  const route = useRoute();
  const { category } = route.params as { category?: string } || {};

  const loadServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const services = await fetchStaffServices();
      console.log(`Found ${services.length} services`);
      setStaffServices(services);
      setFilteredServices(services); // Set all services initially
    } catch (err) {
      console.error('Error loading services:', err);
      setError('Failed to load services. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category === 'All' ? null : category);
    }
    loadServices();
  }, [category, loadServices]);

  useEffect(() => {
    const filtered = staffServices.filter(service => 
      (!selectedCategory || selectedCategory === 'all' || 
        service.subcategory?.name === selectedCategory || 
        service.subcategory?.category?.name === selectedCategory) &&
      (!searchQuery || service.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!minPrice || service.priceperhour >= parseFloat(minPrice)) &&
      (!maxPrice || service.priceperhour <= parseFloat(maxPrice))
    );
    console.log(`Filtered services: ${filtered.length}`);
    console.log('Filter criteria:', { selectedCategory, searchQuery, minPrice, maxPrice });
    console.log('Sample service:', staffServices.length > 0 ? JSON.stringify(staffServices[0]) : 'No services');
    setFilteredServices(filtered);
  }, [staffServices, selectedCategory, searchQuery, minPrice, maxPrice]);

  const renderServiceItem = useCallback(({ item }: { item: Service }) => (
    <ServiceItem item={item} onPress={(id) => navigation.navigate('PersonalDetail', { personalId: id })} />
  ), [navigation]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadServices}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search crew services"
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
      {filteredServices.length > 0 ? (
        <FlatList
          data={filteredServices}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.serviceList}
          contentContainerStyle={styles.serviceListContent}
        />
      ) : (
        <Text style={styles.noServicesText}>No services available</Text>
      )}
    </View>
  );
};

export default PersonalsScreen;