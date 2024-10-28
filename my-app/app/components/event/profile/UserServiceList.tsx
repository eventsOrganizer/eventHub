import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, RefreshControl } from 'react-native';
import { supabase } from '../../../services/supabaseClient';
import { LinearGradient } from 'expo-linear-gradient';
import FilterButtons, { FilterButtonsProps } from '../../../screens/FilterButtons';

interface Service {
  id: number;
  name: string;
  type: string;
  media: { url: string }[];
  details: string;
  priceperhour?: number;
  price?: number;
}

const { width: screenWidth } = Dimensions.get('window');
const containerWidth = screenWidth - 40;
const cardWidth = (containerWidth - 20) / 2; // 2 cards per row
const cardHeight = cardWidth * 1.2; // Slightly taller than wide

const UserServicesList: React.FC<{ userId: string }> = ({ userId }) => {
  const [userServices, setUserServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const fetchUserServices = useCallback(async () => {
    const fetchServicesWithMedia = async (table: string, type: string) => {
      const { data, error } = await supabase
        .from(table)
        .select(`
          id, name, details, priceperhour, price,
          media (url)
        `)
        .eq('user_id', userId);

      if (error) {
        console.error(`Error fetching ${type} services:`, error);
        return [];
      }
      console.log(`${type} services data:`, data);
      return data?.map(s => ({ 
        ...s, 
        type,
        media: s.media || []
      })) || [];
    };

    const personalServices = await fetchServicesWithMedia('personal', 'Crew');
    const localServices = await fetchServicesWithMedia('local', 'Venues');
    const materialServices = await fetchServicesWithMedia('material', 'Products');

    const allServices = [...personalServices, ...localServices, ...materialServices];
    console.log('All services:', JSON.stringify(allServices, null, 2));
    setUserServices(allServices);
    setFilteredServices(allServices);
  }, [userId]);

  useEffect(() => {
    fetchUserServices();
  }, [fetchUserServices]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserServices();
    setRefreshing(false);
  }, [fetchUserServices]);

  const filterServices = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredServices(userServices);
    } else {
      setFilteredServices(userServices.filter(service => service.type === category));
    }
  };

  const renderServiceCard = ({ item: service }: { item: Service }) => {
    console.log('Rendering service:', service.id, service.name);
    console.log('Service media:', service.media);
    const imageUrl = service.media && service.media[0] ? service.media[0].url : 'https://via.placeholder.com/150';
    console.log('Image URL:', imageUrl);

    return (
      <TouchableOpacity style={styles.cardContainer}>
        <LinearGradient
          colors={['#1a1a1a', '#2a2a2a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.image} 
            resizeMode="cover"
            onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
          />
          <View style={styles.textContainer}>
            <Text style={styles.serviceName} numberOfLines={1} ellipsizeMode="tail">
              {service.name}
            </Text>
            <Text style={styles.serviceType} numberOfLines={1} ellipsizeMode="tail">
              {service.type}
            </Text>
            <Text style={styles.servicePrice} numberOfLines={1} ellipsizeMode="tail">
              {service.type === 'Material' 
                ? `$${service.price?.toFixed(2)}` 
                : `$${service.priceperhour?.toFixed(2)}/hr`}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vos services</Text>
      <FilterButtons 
        selectedCategory={selectedCategory}
        onSelectCategory={filterServices}
        categories={['All', 'Personal', 'Local', 'Material']}
      />
      <FlatList
        data={filteredServices}
        renderItem={renderServiceCard}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No services found.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: containerWidth,
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FFFFFF',
    paddingHorizontal: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: cardWidth,
    height: cardHeight,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0', // Ajoutez une couleur de fond pour voir les limites de la carte
  },
  gradientBackground: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
  },
  textContainer: {
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  serviceName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  serviceType: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  servicePrice: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default UserServicesList;
