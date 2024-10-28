import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { fetchUserServices } from '../services/serviceQueries';
import ServiceCard from '../screens/serviceCard';
import FilterButtons from '../screens/FilterButtons';
import { useToast } from '../hooks/useToast';
import { Service } from '../services/serviceTypes';

// Ajoutez cette définition de type
type FilterButtonsProps = {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
};

const UserServicesScreen: React.FC = () => {
  const route = useRoute();
  const { userId } = route.params as { userId: string };
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    loadServices();
  }, [userId]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const fetchedServices = await fetchUserServices(userId);
      setServices(fetchedServices);
      setFilteredServices(fetchedServices);
      
      // Extraire les catégories uniques des services
      const uniqueCategories = ['All', ...new Set(fetchedServices.map(service => service.type ?? 'Uncategorized'))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to load services. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterServices = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter(service => service.type === category));
    }
  };

  const renderServiceItem = ({ item }: { item: Service }) => (
    <ServiceCard item={item} />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Services</Text>
      <FilterButtons 
        selectedCategory={selectedCategory}
        onSelectCategory={filterServices}
        categories={categories}
      />
      <FlatList
        data={filteredServices}
        renderItem={renderServiceItem}
        keyExtractor={item => `${item.id}`}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
  },
  listContainer: {
    padding: 10,
  },
});

export default UserServicesScreen;
