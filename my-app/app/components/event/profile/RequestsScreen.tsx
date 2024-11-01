import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';
import { createEventNotificationSystem } from '../../../services/eventNotificationService';

interface EventRequest {
  id: number;
  user: { id: string; email: string };
  event: { id: number; name: string } | null;
}

const { width, height } = Dimensions.get('window');

const RequestsScreen: React.FC = () => {
  const [eventRequests, setEventRequests] = useState<EventRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { userId } = useUser();
  const { handleEventRequestNotification } = createEventNotificationSystem();

  const fetchEventRequests = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('request')
        .select(`
          id,
          user:user_id (id, email),
          event:event_id (id, name)
        `)
        .eq('status', 'pending')
        .eq('event.user_id', userId);

      if (error) throw error;

      const validRequests = data.filter(request => request.event !== null);
      setEventRequests(validRequests as unknown as EventRequest[]);
    } catch (error) {
      console.error('Error fetching event requests:', error);
      Alert.alert('Error', 'Failed to fetch event requests. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchEventRequests();
  }, [fetchEventRequests]);

  const handleEventRequest = async (requestId: number, status: 'accepted' | 'rejected') => {
    try {
      if (status === 'accepted') {
        const { error } = await supabase
          .from('request')
          .update({ 
            status,
            is_read: true,
            is_action_read: true 
          })
          .eq('id', requestId);

        if (error) throw error;

        const request = eventRequests.find(r => r.id === requestId);
        if (request && request.event) {
          const { error: insertError } = await supabase
            .from('event_has_user')
            .insert({ user_id: request.user.id, event_id: request.event.id });

          if (insertError) throw insertError;
          
          // Create notification for accepted request
          await handleEventRequestNotification(requestId, 'accepted');
        }
      } else {
        const { error } = await supabase
          .from('request')
          .update({ 
            status: 'refused',
            is_read: true,
            is_action_read: true 
          })
          .eq('id', requestId);

        if (error) throw error;

        // Create notification for rejected request
        await handleEventRequestNotification(requestId, 'refused');
      }

      fetchEventRequests();
      Alert.alert('Success', `Request ${status}`);
    } catch (error) {
      console.error('Error handling event request:', error);
      Alert.alert('Error', 'Failed to handle request. Please try again.');
    }
  };

  const renderEventRequest = ({ item }: { item: EventRequest }) => (
    <View style={styles.requestItem}>
      <Text style={styles.requestText}>
        {item.user.email} wants to join {item.event?.name}
      </Text>
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEventRequests();
  }, [fetchEventRequests]);

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Event Requests</Text>
      {eventRequests.length > 0 ? (
        <FlatList
          data={eventRequests}
          renderItem={renderEventRequest}
          keyExtractor={item => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.emptyText}>No pending event requests</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  listContainer: {
    flexGrow: 1,
  },
  requestItem: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#333',
    padding: 20,
    marginBottom: 20,
  },
  requestText: {
    fontSize: 18,
    marginBottom: 15,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
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
    fontSize: 16,
  },
  emptyText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#666',
    marginTop: height * 0.3,
  },
});

export default RequestsScreen;