import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../../services/supabaseClient';
import UserAvatar from '../UserAvatar';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface Friend {
  id: string;
  firstname: string;
  lastname: string;
  avatar_url?: string;
}

type RootStackParamList = {
  OrganizerProfile: { organizerId: string };
  ChatRoom: { organizerId: string };
};

const FriendsList2: React.FC<{ userId: string }> = ({ userId }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchFriends();
  }, [userId]);

  const fetchFriends = async () => {
    // Keeping the exact same working fetch logic
    const { data: friendships, error } = await supabase
      .from('friend')
      .select('user_id, friend_id')
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`);
  
    if (error) {
      console.error('Error fetching friendships:', error);
    } else if (friendships) {
      const friendIds = friendships.map(friendship => 
        friendship.user_id === userId ? friendship.friend_id : friendship.user_id
      );
  
      const { data: friendsData, error: friendsError } = await supabase
        .from('user')
        .select('id, firstname, lastname')
        .in('id', friendIds);
  
      if (friendsError) {
        console.error('Error fetching friends data:', friendsError);
      } else if (friendsData) {
        setFriends(friendsData);
      }
    }
  };

  const deleteFriend = async (friendId: string) => {
    try {
      const { error } = await supabase
        .from('friend')
        .delete()
        .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`);

      if (error) throw error;
      
      setFriends(prev => prev.filter(friend => friend.id !== friendId));
      Alert.alert('Success', 'Friend removed successfully');
    } catch (error) {
      console.error('Error deleting friend:', error);
      Alert.alert('Error', 'Failed to remove friend');
    }
  };

  const confirmDeleteFriend = (friendId: string) => {
    Alert.alert(
      "Remove Friend",
      "Are you sure you want to remove this friend?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          onPress: () => deleteFriend(friendId),
          style: "destructive"
        }
      ]
    );
  };

  const navigateToChat = (friendId: string) => {
    navigation.navigate('ChatRoom', { organizerId: friendId });
  };
  return (
    <View style={styles.container}>
    
      <FlatList
        data={friends}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <TouchableOpacity 
              style={styles.avatarContainer}
              onPress={() => navigation.navigate('OrganizerProfile', { organizerId: item.id })}
            >
              <UserAvatar userId={item.id} size={50} />
              <Text style={styles.friendName}>{`${item.firstname} ${item.lastname}`}</Text>
            </TouchableOpacity>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => navigateToChat(item.id)}
              >
                <Ionicons name="chatbubble" size={20} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => confirmDeleteFriend(item.id)}
              >
                <Ionicons name="trash" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
        horizontal={false} // Only change in the FlatList
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      marginVertical: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    friendItem: {
      flexDirection: 'row', // Changed to row
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      paddingVertical: 10,
      marginBottom: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 10,
    },
    avatarContainer: {
      flexDirection: 'row', // Changed to row
      alignItems: 'center',
      flex: 1,
    },
    friendName: {
      marginLeft: 15, // Changed from marginTop
      fontSize: 16, // Increased from 12
      color: '#333',
    },
    buttonsContainer: {
      flexDirection: 'row',
      gap: 5,
      marginLeft: 10,
    },
    iconButton: {
      padding: 5,
      backgroundColor: '#F8F8F8',
      borderRadius: 15,
    },
  });
  
  export default FriendsList2;







