import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabaseClient';
import UserAvatar from './UserAvatar';
import { useUser } from '../../UserContext';
import tw from 'twrnc';

interface Props {
  eventId: number;
  refreshTrigger: number;
}

interface Friend {
  id: string;
  firstname: string;
  lastname: string;
}

const EventFriends: React.FC<Props> = ({ eventId, refreshTrigger }) => {
  console.log('EventFriends Component Rendered with:', { eventId, refreshTrigger });
  
  const [friendsAttending, setFriendsAttending] = useState<Friend[]>([]);
  const { userId } = useUser();

  useEffect(() => {
    console.log('useEffect triggered with userId:', userId);
    fetchFriendsAttending();
  }, [refreshTrigger, userId]);

  const fetchFriendsAttending = async () => {
    console.log('fetchFriendsAttending started');
    if (!userId) {
      console.log('No userId found, returning early');
      return;
    }

    console.log('Fetching friends for userId:', userId);
    const { data: friendsData, error: friendsError } = await supabase
      .from('friend')
      .select('friend_id, user_id')
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
      .eq('status', 'accepted');

    if (friendsError) {
      console.error('Error fetching friends:', friendsError);
      return;
    }

    console.log('Friends data received:', friendsData);
    const friendIds = friendsData.map(friend => 
      friend.user_id === userId ? friend.friend_id : friend.user_id
    );
    console.log('Processed friend IDs:', friendIds);

    if (friendIds.length === 0) {
      console.log('No friends found, returning early');
      return;
    }

    console.log('Fetching attending friends for event:', eventId);
    const { data: attendingFriends, error: attendingError } = await supabase
      .from('event_has_user')
      .select(`
        user:user_id (
          id,
          firstname,
          lastname
        )
      `)
      .eq('event_id', eventId)
      .in('user_id', friendIds);

    if (attendingError) {
      console.error('Error fetching attending friends:', attendingError);
      return;
    }

    console.log('Attending friends data:', attendingFriends);
    const processedFriends = attendingFriends.map(item => item.user);
    console.log('Processed attending friends:', processedFriends);
    setFriendsAttending(processedFriends);
  };

  console.log('Current friendsAttending state:', friendsAttending);
  if (friendsAttending.length === 0) {
    console.log('No friends attending, returning null');
    return null;
  }

  console.log('Rendering EventFriends component with data');
  return (
    <LinearGradient
      colors={['#4B0082', '#0066CC']}
      style={tw`p-4 rounded-xl mt-4 shadow-lg`}
    >
      <View style={tw`flex-row items-center mb-4`}>
        <Ionicons name="people-circle" size={24} color="white" />
        <Text style={tw`text-lg font-bold text-white ml-2`}>
          Friends Attending ({friendsAttending.length})
        </Text>
      </View>
      <FlatList
        data={friendsAttending}
        renderItem={({ item }) => {
          console.log('Rendering friend item:', item);
          return (
            <View style={tw`mr-3`}>
              <UserAvatar 
                userId={item.id} 
                size={50} 
                style={tw`border-2 border-white shadow-lg`}
              />
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`py-2`}
      />
    </LinearGradient>
  );
};

export default EventFriends;