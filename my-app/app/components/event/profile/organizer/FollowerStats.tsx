import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { supabase } from '../../../../services/supabaseClient';
import tw from 'twrnc';

interface Props {
  organizerId: string;
}

const FollowerStats: React.FC<Props> = ({ organizerId }) => {
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    fetchFollowCounts();
  }, [organizerId]);

  const fetchFollowCounts = async () => {
    try {
      const [followers, following] = await Promise.all([
        supabase
          .from('follow')
          .select('*', { count: 'exact' })
          .eq('following_id', organizerId),
        supabase
          .from('follow')
          .select('*', { count: 'exact' })
          .eq('follower_id', organizerId)
      ]);

      setFollowersCount(followers.count || 0);
      setFollowingCount(following.count || 0);
    } catch (error) {
      console.error('Error fetching follow counts:', error);
    }
  };

  return (
    <View style={tw`flex-row justify-around py-2`}>
      <View style={tw`items-center`}>
        <Text style={tw`text-white text-xl font-bold`}>{followersCount}</Text>
        <Text style={tw`text-gray-400 text-sm`}>Followers</Text>
      </View>
      <View style={tw`items-center`}>
        <Text style={tw`text-white text-xl font-bold`}>{followingCount}</Text>
        <Text style={tw`text-gray-400 text-sm`}>Following</Text>
      </View>
    </View>
  );
};

export default FollowerStats;