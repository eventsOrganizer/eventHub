import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../../services/supabaseClient';
import { useUser } from '../../../../UserContext';
import tw from 'twrnc';

interface Props {
  organizerId: string;
}

const FollowerStats: React.FC<Props> = ({ organizerId }) => {
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const navigation = useNavigation();
  const { userId: currentUserId } = useUser();

  useEffect(() => {
    fetchFollowCounts();
  }, [organizerId]);

  const fetchFollowCounts = async () => {
    try {
      const [followers, following] = await Promise.all([
        supabase
          .from('follower')
          .select('*', { count: 'exact' })
          .eq('following_id', organizerId),
        supabase
          .from('follower')
          .select('*', { count: 'exact' })
          .eq('follower_id', organizerId)
      ]);

      setFollowersCount(followers.count || 0);
      setFollowingCount(following.count || 0);
    } catch (error) {
      console.error('Error fetching follow counts:', error);
    }
  };

  const handleFollowersPress = () => {
    navigation.navigate('Followers', {
      userId: organizerId,
      isOwnProfile: currentUserId === organizerId
    });
  };

  const handleFollowingPress = () => {
    navigation.navigate('Following', {
      userId: organizerId,
      isOwnProfile: currentUserId === organizerId
    });
  };

  return (
    <View style={tw`flex-row justify-around py-2`}>
      <TouchableOpacity 
        style={tw`items-center`} 
        onPress={handleFollowersPress}
      >
        <Text style={tw`text-white text-xl font-bold`}>{followersCount}</Text>
        <Text style={tw`text-gray-400 text-sm`}>Followers</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={tw`items-center`} 
        onPress={handleFollowingPress}
      >
        <Text style={tw`text-white text-xl font-bold`}>{followingCount}</Text>
        <Text style={tw`text-gray-400 text-sm`}>Following</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FollowerStats;