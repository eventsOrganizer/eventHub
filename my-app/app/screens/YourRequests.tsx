import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Image } from 'react-native';
import { supabase } from '../services/supabaseClient';
import { useUser } from '../UserContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FontAwesome } from 'react-native-vector-icons'; // Import additional icon set if needed

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
      // Fetch personal service requests with service names, subcategories, and images
      const { data: personalRequests, error: personalError } = await supabase
        .from('personal_user')
        .select(`personal_id, status, personal:personal_id (name, subcategory:subcategory_id (name), media (url))`)
        .eq('user_id', userId);

      // Fetch local service requests with service names, subcategories, and images
      const { data: localRequests, error: localError } = await supabase
        .from('local_user')
        .select(`local_id, status, local:local_id (name, subcategory:subcategory_id (name), media (url))`)
        .eq('user_id', userId);

      // Fetch material service requests with service names, subcategories, and images
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

  // Function to dynamically set the background color based on status
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
        return <Icon name="hourglass-empty" size={20} color="#000" />;
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
        return <Icon name="shopping-cart" size={20} color="#000" />; // Changed to a shopping cart icon
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
              <Icon name="location-on" size={24} color={selectedCategory === 'Local' ? '#4CAF50' : '#000'} />
              <Text style={[styles.filterText, selectedCategory === 'Local' && styles.activeFilterText]}>Local</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => filterRequests('Personal')} style={styles.filterButton}>
              <Icon name="people" size={24} color={selectedCategory === 'Personal' ? '#4CAF50' : '#000'} />
              <Text style={[styles.filterText, selectedCategory === 'Personal' && styles.activeFilterText]}>Personal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => filterRequests('Material')} style={styles.filterButton}>
              <Icon name="build" size={24} color={selectedCategory === 'Material' ? '#4CAF50' : '#000'} />
              <Text style={[styles.filterText, selectedCategory === 'Material' && styles.activeFilterText]}>Material</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredRequests}
            renderItem={({ item }) => (
              <View style={[styles.requestItem, { backgroundColor: getBackgroundColor(item.status) }]}>
                <View style={styles.requestContent}>
                  {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.requestImage} />}
                  <View style={styles.requestTextContainer}>
                    <View style={styles.requestHeader}>
                      <Text style={styles.serviceName}>{item.name || 'Unnamed Service'}</Text>
                      {getCategoryIcon(item.type)}
                    </View>
                    <View style={styles.requestDetails}>
                      <Text style={styles.subcategoryName}>{item.subcategory || 'Unknown Subcategory'}</Text>
                      {getStatusIcon(item.status)}
                    </View>
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
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  requestContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  requestDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  requestType: {
    fontSize: 16,
    color: '#555',
  },
  subcategoryName: {
    fontSize: 16,
    color: '#555',
  },
  requestStatus: {
    fontSize: 16,
    color: '#666',
  },
  requestImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
});

export default YourRequests;
