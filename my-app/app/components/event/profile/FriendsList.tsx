import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../../../services/supabaseClient';
import UserAvatar from '../UserAvatar';
import { useNavigation, NavigationProp } from '@react-navigation/native';

interface Friend {
  id: string;
  firstname: string;
  lastname: string;
  avatar_url?: string;
}

type RootStackParamList = {
  OrganizerProfile: { organizerId: string };
};

const FriendsList: React.FC<{ userId: string }> = ({ userId }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchFriends();
  }, [userId]);

  const fetchFriends = async () => {
    // Fetch friendships where the user is either user_id or friend_id
    const { data: friendships, error } = await supabase
      .from('friend')
      .select('user_id, friend_id')
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`);
  
    if (error) {
      console.error('Error fetching friendships:', error);
    } else if (friendships) {
      // Extract friend IDs, excluding the user's own ID
      const friendIds = friendships.map(friendship => 
        friendship.user_id === userId ? friendship.friend_id : friendship.user_id
      );
  
      // Fetch friend details
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

  const navigateToFriendProfile = (friendId: string) => {
    navigation.navigate('OrganizerProfile', { organizerId: friendId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      <FlatList
        data={friends}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.friendItem} 
            onPress={() => navigateToFriendProfile(item.id)}
          >
            <UserAvatar userId={item.id} size={50} />
            <Text style={styles.friendName}>{`${item.firstname} ${item.lastname}`}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
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
    alignItems: 'center',
    marginRight: 15,
    width: 80,
  },
  friendName: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 12,
  },
});

export default FriendsList;