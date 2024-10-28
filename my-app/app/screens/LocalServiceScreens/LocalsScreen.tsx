import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LocalScreenNavigationProp } from '../../navigation/types'; // Adjust import as necessary
import { Service } from '../../services/serviceTypes'; // Adjust import as necessary
import { fetchLocalServices } from '../../services/localService'; // Adjust import as necessary
import LocalCategoryList from './components/LocalCategoryList'; // Adjust import as necessary
import LocalItem from './LocalItem'; // Adjust import as necessary
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FAB } from 'react-native-paper';

const LocalsScreen: React.FC = () => {
  const [localServices, setLocalServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [displayedServices, setDisplayedServices] = useState<Service[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigation = useNavigation<LocalScreenNavigationProp>();
  const route = useRoute();
  const { category } = route.params as { category?: string } || {};

  const loadServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const services = await fetchLocalServices(); // Fetch local services
      setLocalServices(services as unknown as Service[]); // Cast to Service[]
      setFilteredServices(services as unknown as Service[]); // Cast to Service[]
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
    const filtered = localServices.filter(service => 
      (!selectedCategory || selectedCategory === 'all' || 
        service.subcategory?.name === selectedCategory || 
        service.subcategory?.category?.name === selectedCategory) &&
      (!searchQuery || service.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!minPrice || service.priceperhour >= parseFloat(minPrice)) &&
      (!maxPrice || service.priceperhour <= parseFloat(maxPrice))
    );
    setFilteredServices(filtered);
  }, [localServices, selectedCategory, searchQuery, minPrice, maxPrice]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedServices(filteredServices.slice(0, endIndex));
  }, [filteredServices, currentPage]);

  const loadMoreServices = () => {
    if (displayedServices.length < filteredServices.length) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const renderServiceItem = useCallback(({ item }: { item: Service }) => (
    <LocalItem item={item} onPress={(id) => navigation.navigate('LocalServiceDetails', { localId: id })} />
  ), [navigation]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer as ViewStyle}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadServices}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#D0DCE8', '#B8C8D9', '#A0B4CA', '#88A0BB']}
      style={styles.container as ViewStyle}
    >
      <View style={styles.filterContainer as ViewStyle}>
        <View style={styles.searchBar as ViewStyle}>
          <Ionicons name="search" size={18} color="#FFFFFF" style={styles.searchIcon as TextStyle} />
          <TextInput
            style={styles.searchInput as TextStyle}
            placeholder="Rechercher des services"
            placeholderTextColor="#CCCCCC"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View style={styles.priceFilter as ViewStyle}>
          <TextInput
            style={styles.priceInput as TextStyle}
            placeholder="Min"
            placeholderTextColor="#CCCCCC"
            value={minPrice}
            onChangeText={setMinPrice}
            keyboardType="numeric"
          />
         <Text style={styles.priceSeparator}>-</Text>
          <TextInput
            style={styles.priceInput as TextStyle}
            placeholder="Max"
            placeholderTextColor="#CCCCCC"
            value={maxPrice}
            onChangeText={setMaxPrice}
            keyboardType="numeric"
          />
        </View>
      </View>
      <LocalCategoryList selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      {filteredServices.length > 0 ? (
        <FlatList
          data={displayedServices}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.serviceList}
          contentContainerStyle={styles.serviceListContent}
          onEndReached={loadMoreServices}
          onEndReachedThreshold={0.1}
        />
      ) : (
        <Text style={{...styles.noServicesText, textAlign: 'center'}}>Aucun service disponible</Text>
      )}
      <FAB
        style={{...styles.fab, position: 'absolute', margin: 10, right: 10, bottom: 10, backgroundColor: '#4A90E2'}}
        icon="plus"
        onPress={() => {navigation.navigate('CreateLocalServiceStack' as never)}} // Adjust navigation
      />
    </LinearGradient>
  );
};

// Styles remain the same as in PersonalsScreen
const styles = {
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  filterContainer: {
    backgroundColor: '#3A7BD5',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5A9AE4',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 32,
    color: '#FFFFFF',
    fontSize: 14,
  },
  priceFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceInput: {
    backgroundColor: '#5A9AE4',
    borderRadius: 8,
    padding: 6,
    width: '45%',
    color: '#FFFFFF',
    fontSize: 14,
  },
  priceSeparator: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  serviceList: {
    flex: 1,
  },
  serviceListContent: {
    padding: 10,
  },
  noServicesText: {
    fontSize: 18,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4A90E2',
  },
};

export default LocalsScreen;
