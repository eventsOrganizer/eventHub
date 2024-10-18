import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../services/supabaseClient';
import { useUser } from '../UserContext';

interface Request {
  id: number;
  name: string;
  type: string;
  status: string;
  subcategory: string;
}

const YourRequests: React.FC = () => {
  const { userId } = useUser();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchRequests();
    }
  }, [userId]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Fetch personal service requests with service names and subcategories
      const { data: personalRequests, error: personalError } = await supabase
        .from('personal_user')
        .select(`
          personal_id,
          status,
          personal:personal_id (
            name,
            subcategory:subcategory_id (name)
          )
        `)
        .eq('user_id', userId);

      // Fetch local service requests with service names and subcategories
      const { data: localRequests, error: localError } = await supabase
        .from('local_user')
        .select(`
          local_id,
          status,
          local:local_id (
            name,
            subcategory:subcategory_id (name)
          )
        `)
        .eq('user_id', userId);

      // Fetch material service requests with service names and subcategories
      const { data: materialRequests, error: materialError } = await supabase
        .from('material_user')
        .select(`
          material_id,
          status,
          material:material_id (
            name,
            subcategory:subcategory_id (name)
          )
        `)
        .eq('user_id', userId);

      if (personalError) {
        console.error('Personal requests error:', personalError);
        throw new Error('Error fetching personal requests');
      }

      if (localError) {
        console.error('Local requests error:', localError);
        throw new Error('Error fetching local requests');
      }

      if (materialError) {
        console.error('Material requests error:', materialError);
        throw new Error('Error fetching material requests');
      }

      const allRequests = [
        ...(personalRequests || []).map(req => ({
          id: req.personal_id,
          name: req.personal.name || 'Unnamed Service',
          status: req.status || 'Unknown Status',
          type: 'Personal',
          subcategory: req.personal.subcategory.name || 'Unknown Subcategory'
        })),
        ...(localRequests || []).map(req => ({
          id: req.local_id,
          name: req.local.name || 'Unnamed Service',
          status: req.status || 'Unknown Status',
          type: 'Local',
          subcategory: req.local.subcategory.name || 'Unknown Subcategory'
        })),
        ...(materialRequests || []).map(req => ({
          id: req.material_id,
          name: req.material.name || 'Unnamed Service',
          status: req.status || 'Unknown Status',
          type: 'Material',
          subcategory: req.material.subcategory.name || 'Unknown Subcategory'
        })),
      ];

      setRequests(allRequests);
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
        return '#4CAF50'; // Green for confirmed
      case 'pending':
        return '#FF9800'; // Orange for pending
      case 'rejected':
        return '#757575'; // Dark grey for rejected
      default:
        return '#FFFFFF'; // Default white background
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Requests</Text>
      <FlatList
        data={requests}
        renderItem={({ item }) => (
          <View style={[styles.requestItem, { backgroundColor: getBackgroundColor(item.status) }]}>
            <View style={styles.requestHeader}>
              <Text style={styles.serviceName}>{item.name || 'Unnamed Service'}</Text>
              <Text style={styles.requestType}>{item.type || 'Unknown Type'}</Text>
            </View>
            <View style={styles.requestDetails}>
              <Text style={styles.subcategoryName}>{item.subcategory || 'Unknown Subcategory'}</Text>
              <Text style={styles.requestStatus}>{item.status || 'Unknown Status'}</Text>
            </View>
          </View>
        )}
        keyExtractor={item => `${item.type}-${item.id}`}
      />
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
  requestItem: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
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
});

export default YourRequests;
