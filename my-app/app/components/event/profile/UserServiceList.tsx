import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions, RefreshControl } from 'react-native';
import { supabase } from '../../../services/supabaseClient';
import { LinearGradient } from 'expo-linear-gradient';

interface Service {
  id: number;
  name: string;
  type: string;
  media: { url: string }[];
}

const { width: screenWidth } = Dimensions.get('window');
const containerWidth = screenWidth - 40;
const cardWidth = (containerWidth - 40) / 3;
const cardHeight = cardWidth;

const UserServicesList: React.FC<{ userId: string }> = ({ userId }) => {
  const [userServices, setUserServices] = useState<Service[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserServices = useCallback(async () => {
    const fetchServicesWithMedia = async (table: string, type: string) => {
      const { data, error } = await supabase
        .from(table)
        .select(`
          id, name,
          media (url)
        `)
        .eq('user_id', userId);

      if (error) {
        console.error(`Error fetching ${type} services:`, error);
        return [];
      }
      return data?.map(s => ({ ...s, type })) || [];
    };

    const personalServices = await fetchServicesWithMedia('personal', 'Personal');
    const localServices = await fetchServicesWithMedia('local', 'Local');
    const materialServices = await fetchServicesWithMedia('material', 'Material');

    const allServices = [...personalServices, ...localServices, ...materialServices];
    setUserServices(allServices);
  }, [userId]);

  useEffect(() => {
    fetchUserServices();
  }, [fetchUserServices]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserServices();
    setRefreshing(false);
  }, [fetchUserServices]);

  const renderServiceCard = (service: Service) => (
    <TouchableOpacity key={`${service.type}-${service.id}`} style={styles.cardContainer}>
      <LinearGradient
        colors={['#1a1a1a', '#2a2a2a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <Image source={{ uri: service.media[0]?.url || 'https://via.placeholder.com/150' }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.serviceName} numberOfLines={1} ellipsizeMode="tail">
            {service.name}
          </Text>
          <Text style={styles.serviceType} numberOfLines={1} ellipsizeMode="tail">
            {service.type}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderServicePages = () => {
    const pages = [];
    for (let i = 0; i < userServices.length; i += 9) {
      const pageServices = userServices.slice(i, i + 9);
      pages.push(
        <View key={i} style={styles.page}>
          {pageServices.map(renderServiceCard)}
        </View>
      );
    }
    return pages;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Services</Text>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollViewContent}
      >
        {userServices.length > 0 ? (
          renderServicePages()
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No services found.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    height: cardHeight * 3 + 80,
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
  scrollViewContent: {
    alignItems: 'flex-start',
  },
  page: {
    width: containerWidth,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: cardWidth,
    height: cardHeight,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  gradientBackground: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
  },
  textContainer: {
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  serviceName: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  serviceType: {
    color: '#ccc',
    fontSize: 8,
    textAlign: 'center',
  },
  emptyContainer: {
    width: containerWidth,
    height: cardHeight * 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default UserServicesList;