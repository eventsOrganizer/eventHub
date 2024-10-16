import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';
import FriendRequestItem from './FriendRequestItem';

interface FriendRequest {
  id: number;
  user: { id: string; email: string };
}

const FriendRequestsScreen: React.FC = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useUser();

  useEffect(() => {
    fetchFriendRequests();
  }, [userId]);

  const fetchFriendRequests = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('request')
        .select(`
          id,
          user:user_id (id, email)
        `)
        .eq('status', 'pending')
        .eq('friend_id', userId)
        .is('event_id', null);

      if (error) throw error;
      setFriendRequests(data as unknown as FriendRequest[]);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    } finally {
      setLoading(false);
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
      <Text style={styles.title}>Friend Requests</Text>
      {friendRequests.length > 0 ? (
        <FlatList
          data={friendRequests}
          renderItem={({ item }) => (
            <FriendRequestItem request={item} onRequestHandled={fetchFriendRequests} />
          )}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <Text style={styles.emptyText}>No pending friend requests</Text>
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

export default FriendRequestsScreen;