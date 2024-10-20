import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Image } from 'react-native';
import { supabase } from '../services/supabaseClient';
import { useUser } from '../UserContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Request {
  id: number;
  name: string;
  type: string;
  status: string;
  subcategory: string;
  imageUrl: string | null;
}

const YourRequests: React.FC = () => {
  const { userId } = useUser();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    if (userId) {
      fetchRequests();
    }
  }, [userId]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data: personalRequests, error: personalError } = await supabase
        .from('personal_user')
        .select(`personal_id, status, personal:personal_id (name, subcategory:subcategory_id (name), media (url))`)
        .eq('user_id', userId);

      const { data: localRequests, error: localError } = await supabase
        .from('local_user')
        .select(`local_id, status, local:local_id (name, subcategory:subcategory_id (name), media (url))`)
        .eq('user_id', userId);

      const { data: materialRequests, error: materialError } = await supabase
        .from('material_user')
        .select(`material_id, status, material:material_id (name, subcategory:subcategory_id (name), media (url))`)
        .eq('user_id', userId);

      if (personalError || localError || materialError) {
        throw new Error('Error fetching requests');
      }

      const allRequests = [
        ...(personalRequests || []).map(req => ({
          id: req.personal_id,
          name: req.personal.name || 'Unnamed Service',
          status: req.status || 'Unknown Status',
          type: 'Personal',
          subcategory: req.personal.subcategory.name || 'Unknown Subcategory',
          imageUrl: req.personal.media.length > 0 ? req.personal.media[0].url : null,
        })),
        ...(localRequests || []).map(req => ({
          id: req.local_id,
          name: req.local.name || 'Unnamed Service',
          status: req.status || 'Unknown Status',
          type: 'Local',
          subcategory: req.local.subcategory.name || 'Unknown Subcategory',
          imageUrl: req.local.media.length > 0 ? req.local.media[0].url : null,
        })),
        ...(materialRequests || []).map(req => ({
          id: req.material_id,
          name: req.material.name || 'Unnamed Service',
          status: req.status || 'Unknown Status',
          type: 'Material',
          subcategory: req.material.subcategory.name || 'Unknown Subcategory',
          imageUrl: req.material.media.length > 0 ? req.material.media[0].url : null,
        })),
      ];

      setRequests(allRequests);
      setFilteredRequests(allRequests);
    } catch (error) {
      console.error('Error fetching event requests:', error);
      Alert.alert('Error', 'Failed to fetch event requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getBackgroundColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return '#A5D6A7'; // Lighter green for confirmed
      case 'pending':
        return '#FFF9C4'; // Original yellow for pending
      case 'rejected':
        return '#EF9A9A'; // Light red for rejected
      default:
        return '#fff';
    }
  };

  const filterRequests = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(request => request.type === category));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <Icon name="check-circle" size={20} color="#000" />;
      case 'pending':
        return <Icon name="hourglass-top" size={20} color="#000" />;
      case 'rejected':
        return <Icon name="cancel" size={20} color="#000" />;
      default:
        return <Icon name="help-outline" size={20} color="#000" />;
    }
  };

  const getCategoryIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'personal':
        return <Icon name="person" size={20} color="#000" />;
      case 'local':
        return <Icon name="location-on" size={20} color="#000" />;
      case 'material':
        return <Icon name="shopping-cart" size={20} color="#000" />;
      default:
        return <Icon name="help-outline" size={20} color="#000" />;
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          <Text style={styles.title}>Your Requests</Text>

          {/* Category Filter */}
          <View style={styles.filterContainer}>
            <TouchableOpacity onPress={() => filterRequests('All')} style={styles.filterButton}>
              <Icon name="filter-list" size={24} color={selectedCategory === 'All' ? '#4CAF50' : '#000'} />
              <Text style={[styles.filterText, selectedCategory === 'All' && styles.activeFilterText]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => filterRequests('Local')} style={styles.filterButton}>
              {getCategoryIcon('local')}
              <Text style={[styles.filterText, selectedCategory === 'Local' && styles.activeFilterText]}>Local</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => filterRequests('Personal')} style={styles.filterButton}>
              {getCategoryIcon('personal')}
              <Text style={[styles.filterText, selectedCategory === 'Personal' && styles.activeFilterText]}>Personal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => filterRequests('Material')} style={styles.filterButton}>
              {getCategoryIcon('material')}
              <Text style={[styles.filterText, selectedCategory === 'Material' && styles.activeFilterText]}>Material</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredRequests}
            renderItem={({ item }) => (
              <View style={[styles.requestItem, { backgroundColor: getBackgroundColor(item.status) }]}>
                <Image source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} style={styles.requestImage} />
                <View style={styles.requestDetailsContainer}>
                  <Text style={styles.serviceName}>{item.name}</Text>
                  <Text style={styles.subcategoryName}>{item.subcategory}</Text>
                  <View style={styles.iconsContainer}>
                    {getCategoryIcon(item.type)}
                    {getStatusIcon(item.status)}
                  </View>
                </View>
              </View>
            )}
            keyExtractor={item => `${item.type}-${item.id}`}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 12,
    color: '#000',
  },
  activeFilterText: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  requestItem: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  requestImage: {
    width: '30%',
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  requestDetailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subcategoryName: {
    fontSize: 14,
    color: '#757575',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default YourRequests;
