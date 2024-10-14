import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';

interface Request {
  id: number;
  user: { id: string; email: string };
  event: { id: number; name: string };
}

const RequestsScreen: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useUser();

  useEffect(() => {
    fetchRequests();
  }, [userId]);

  const fetchRequests = async () => {
    if (!userId) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('request')
      .select(`
        id,
        event:event_id (id, name),
        user:user_id (id, email)
      `)
      .eq('status', 'pending')
      .eq('event.user_id', userId);

    if (error) {
      console.error('Error fetching requests:', error);
      Alert.alert('Error', 'Failed to fetch requests. Please try again.');
    } else {
      setRequests(data as unknown as Request[]);
    }
    setLoading(false);
  };

  const handleRequest = async (requestId: number, status: 'accepted' | 'rejected') => {
    setLoading(true);
    const { error } = await supabase
      .from('request')
      .update({ status })
      .eq('id', requestId);

    if (error) {
      console.error('Error updating request:', error);
      Alert.alert('Error', 'Failed to update request. Please try again.');
    } else {
      if (status === 'accepted') {
        const request = requests.find(r => r.id === requestId);
        if (request) {
          const { error: insertError } = await supabase
            .from('event_has_user')
            .insert({ user_id: request.user.id, event_id: request.event.id });

          if (insertError) {
            console.error('Error adding user to event:', insertError);
            Alert.alert('Error', 'Failed to add user to event. Please try again.');
          }
        }
      }
      fetchRequests();
      Alert.alert('Success', `Request ${status}`);
    }
    setLoading(false);
  };

  const renderRequest = ({ item }: { item: Request }) => (
    <View style={styles.requestItem}>
      <Text style={styles.requestText}>{item.user.email} wants to join {item.event.name}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={() => handleRequest(item.id, 'accepted')}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => handleRequest(item.id, 'rejected')}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
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
      <Text style={styles.title}>Join Requests</Text>
      {requests.length > 0 ? (
        <FlatList
          data={requests}
          renderItem={renderRequest}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <Text style={styles.emptyText}>No pending requests</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  requestItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  requestText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RequestsScreen;






