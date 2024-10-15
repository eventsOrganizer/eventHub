import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';

interface EventRequest {
  id: number;
  user: { id: string; email: string };
  event: { id: number; name: string };
}

const RequestsScreen: React.FC = () => {
  const [eventRequests, setEventRequests] = useState<EventRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useUser();

  useEffect(() => {
    fetchEventRequests();
  }, [userId]);

  const fetchEventRequests = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('request')
        .select(`
          id,
          event:event_id (id, name),
          user:user_id (id, email)
        `)
        .eq('status', 'pending')
        .eq('event.user_id', userId)
        .is('friend_id', null);

      if (error) throw error;
      setEventRequests(data as unknown as EventRequest[]);
    } catch (error) {
      console.error('Error fetching event requests:', error);
      Alert.alert('Error', 'Failed to fetch event requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEventRequest = async (requestId: number, status: 'accepted' | 'rejected') => {
    setLoading(true);
    try {
      if (status === 'accepted') {
        const { error } = await supabase
          .from('request')
          .update({ status })
          .eq('id', requestId);

        if (error) throw error;

        const request = eventRequests.find(r => r.id === requestId);
        if (request && request.event) {
          const { error: insertError } = await supabase
            .from('event_has_user')
            .insert({ user_id: request.user.id, event_id: request.event.id });

          if (insertError) throw insertError;
        }
      } else {
        const { error } = await supabase
          .from('request')
          .delete()
          .eq('id', requestId);

        if (error) throw error;
      }

      fetchEventRequests();
      Alert.alert('Success', `Request ${status}`);
    } catch (error) {
      console.error('Error handling event request:', error);
      Alert.alert('Error', 'Failed to handle request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderEventRequest = ({ item }: { item: EventRequest }) => (
    <View style={styles.requestItem}>
      <Text style={styles.requestText}>{item.user.email} wants to join {item.event.name}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={() => handleEventRequest(item.id, 'accepted')}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => handleEventRequest(item.id, 'rejected')}
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
      <Text style={styles.title}>Event Requests</Text>
      {eventRequests.length > 0 ? (
        <FlatList
          data={eventRequests}
          renderItem={renderEventRequest}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <Text style={styles.emptyText}>No pending event requests</Text>
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
  },
  requestItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  requestText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});

export default RequestsScreen;