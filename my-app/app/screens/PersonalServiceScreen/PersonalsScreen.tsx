import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { FAB } from 'react-native-paper';
import { MotiView } from 'moti';
import { PersonalScreenNavigationProp } from '../../navigation/types';
import { Service } from '../../services/serviceTypes';
import { fetchStaffServices } from '../../services/personalService';
import CategoryList from '../../components/PersonalServiceComponents/CategoryList';
import ServiceItem from './ServiceItem';
import { theme } from '../../../lib/theme';

const PersonalsScreen: React.FC = () => {
  const [staffServices, setStaffServices] = useState<Service[]>([]);
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

  const navigation = useNavigation<PersonalScreenNavigationProp>();
  const route = useRoute();
  const { category } = route.params as { category?: string } || {};

  const loadServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const services = await fetchStaffServices();
      setStaffServices(services);
      setFilteredServices(services);
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
    setFilteredServices(filtered);
  }, [staffServices, selectedCategory, searchQuery, minPrice, maxPrice]);

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
    <ServiceItem item={item} onPress={(id) => navigation.navigate('PersonalDetail', { personalId: id })} />
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
      colors={[theme.colors.gradientStart, theme.colors.gradientMiddle, theme.colors.gradientEnd]}
      style={styles.container}
    >
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500 }}
        style={styles.content}
      >
        <BlurView intensity={80} tint="light" style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={theme.colors.secondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search services"
              placeholderTextColor={theme.colors.cardDescription}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <View style={styles.priceFilter}>
            <TextInput
              style={styles.priceInput}
              placeholder="Min price"
              placeholderTextColor={theme.colors.cardDescription}
              value={minPrice}
              onChangeText={setMinPrice}
              keyboardType="numeric"
            />
            <View style={styles.priceSeparator} />
            <TextInput
              style={styles.priceInput}
              placeholder="Max price"
              placeholderTextColor={theme.colors.cardDescription}
              value={maxPrice}
              onChangeText={setMaxPrice}
              keyboardType="numeric"
            />
          </View>
        </BlurView>

        <CategoryList selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.accent} />
          </View>
        ) : error ? (
          <BlurView intensity={80} tint="light" style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadServices}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </BlurView>
        ) : (
          <FlatList
            data={displayedServices}
            renderItem={renderServiceItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.serviceListContent}
            onEndReached={loadMoreServices}
            onEndReachedThreshold={0.1}
            showsVerticalScrollIndicator={false}
          />
        )}

        <FAB
          style={styles.fab}
          icon="plus"
          color={theme.colors.primary}
          onPress={() => navigation.navigate('CreatePersonalServiceStack' as never)}
        />
      </MotiView>
    </LinearGradient>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: theme.spacing.xl,
  },
  searchContainer: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    color: theme.colors.secondary,
    fontSize: theme.typography.body.fontSize,
  },
  priceFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceInput: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.secondary,
    fontSize: theme.typography.body.fontSize,
  },
  priceSeparator: {
    width: theme.spacing.md,
    height: 1,
    backgroundColor: theme.colors.accent,
    marginHorizontal: theme.spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    margin: theme.spacing.md,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
  },
  errorText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  retryButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  serviceListContent: {
    padding: theme.spacing.md,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.xl,
    backgroundColor: theme.colors.accent,
  },
};

export default PersonalsScreen;
