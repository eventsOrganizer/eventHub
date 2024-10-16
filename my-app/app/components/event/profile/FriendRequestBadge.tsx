import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';
import { useNavigation } from '@react-navigation/native';

const FriendRequestBadge: React.FC = () => {
  const [requestCount, setRequestCount] = useState(0);
  const { userId } = useUser();
  const navigation = useNavigation();

  useEffect(() => {
    fetchFriendRequestCount();
  }, [userId]);

  const fetchFriendRequestCount = async () => {
    if (!userId) return;

    const { count, error } = await supabase
      .from('request')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')
      .eq('friend_id', userId)
      .is('event_id', null);

    if (error) {
      console.error('Error fetching friend request count:', error);
    } else {
      setRequestCount(count || 0);
    }
  };

  const handlePress = () => {
    navigation.navigate('FriendRequests' as never);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.container}>
        <Ionicons name="people" size={24} color="#4267B2" />
        {requestCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>+{requestCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default FriendRequestBadge;