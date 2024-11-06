import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { supabase } from '../../../../services/supabaseClient';
import tw from 'twrnc';

interface Friend {
  id: string;
  firstname: string;
  lastname: string;
  avatar_url?: string;
}

interface Props {
  currentUserId: string;
  organizerId: string;
}

const FriendsInCommon: React.FC<Props> = ({ currentUserId, organizerId }) => {
  const [commonFriends, setCommonFriends] = useState<Friend[]>([]);

  useEffect(() => {
    console.log('FriendsInCommon mounted with:', { currentUserId, organizerId });
    fetchCommonFriends();
  }, [currentUserId, organizerId]);

  const fetchCommonFriends = async () => {
    try {
      console.log('Fetching friends for users:', { currentUserId, organizerId });
      
      // Get all friends where status is accepted for both users
      const { data: allFriends, error } = await supabase
        .from('friend')
        .select(`
          user_id,
          friend_id,
          status
        `)
        // .eq('status', 'accepted')
        .or(`user_id.eq.${currentUserId},friend_id.eq.${currentUserId},user_id.eq.${organizerId},friend_id.eq.${organizerId}`);

      console.log('All friends data:', allFriends);
      console.log('Query error:', error);

      if (error) throw error;

      // Get current user's friends IDs
      const currentUserFriends = new Set(
        allFriends
          ?.filter(f => f.user_id === currentUserId || f.friend_id === currentUserId)
          .map(f => f.user_id === currentUserId ? f.friend_id : f.user_id)
      );

      console.log('Current user friends:', [...currentUserFriends]);

      // Get organizer's friends IDs
      const organizerFriends = new Set(
        allFriends
          ?.filter(f => f.user_id === organizerId || f.friend_id === organizerId)
          .map(f => f.user_id === organizerId ? f.friend_id : f.user_id)
      );

      console.log('Organizer friends:', [...organizerFriends]);

      // Find common friends
      const commonFriendIds = [...currentUserFriends].filter(id => 
        organizerFriends.has(id) && id !== currentUserId && id !== organizerId
      );

      console.log('Common friend IDs:', commonFriendIds);

      if (commonFriendIds.length > 0) {
        // Fetch user details for common friends
        const { data: friendsData, error: error2 } = await supabase
          .from('user')
          .select('id, firstname, lastname')
          .in('id', commonFriendIds);

        console.log('Friends data:', friendsData);
        console.log('Friends data error:', error2);

        if (error2) throw error2;

        // Fetch media for each friend
        const friendsWithMedia = await Promise.all(
          friendsData!.map(async (friend) => {
            const { data: mediaData, error: mediaError } = await supabase
              .from('media')
              .select('url')
              .eq('user_id', friend.id)
              .single();

            console.log(`Media for friend ${friend.id}:`, mediaData);
            console.log(`Media error for friend ${friend.id}:`, mediaError);

            return {
              ...friend,
              avatar_url: mediaData?.url || 'https://via.placeholder.com/150'
            };
          })
        );

        console.log('Final friends with media:', friendsWithMedia);
        setCommonFriends(friendsWithMedia);
      } else {
        console.log('No common friends found');
        setCommonFriends([]);
      }
    } catch (error) {
      console.error('Error in fetchCommonFriends:', error);
    }
  };

  return (
    <View style={tw`mt-4`}>
      <Text style={tw`text-white text-xl font-bold mb-2`}>
        Friends in Common ({commonFriends.length})
      </Text>
      <FlatList
        horizontal
        data={commonFriends}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={tw`mr-4 items-center`}>
            <Image
              source={{ uri: item.avatar_url }}
              style={tw`w-16 h-16 rounded-full`}
            />
            <Text style={tw`text-white text-sm mt-1`}>
              {`${item.firstname} ${item.lastname}`}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={tw`text-white/70 text-sm`}>No friends in common</Text>
        }
      />
    </View>
  );
};

export default FriendsInCommon;