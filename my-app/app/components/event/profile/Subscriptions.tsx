import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';
import tw from 'twrnc';

interface SubscriptionsProps {
  type: 'followers' | 'following';
}

const Subscriptions: React.FC<SubscriptionsProps> = ({ type }) => {
  const [count, setCount] = useState(0);
  const { userId } = useUser();
  const navigation = useNavigation();

  useEffect(() => {
    fetchCount();
  }, [userId, type]);

  const fetchCount = async () => {
    try {
      const { data, error, count } = await supabase
        .from('follower')
        .select('*', { count: 'exact' })
        .eq(type === 'followers' ? 'following_id' : 'follower_id', userId);

      if (error) throw error;
      setCount(count || 0);
    } catch (error) {
      console.error('Error fetching followers/following:', error);
    }
  };

  const handlePress = () => {
    navigation.navigate(type === 'followers' ? 'Followers' : 'Following');
  };

  return (
    <TouchableOpacity 
      style={tw`items-center`} 
      onPress={handlePress}
    >
      <Text style={tw`text-white text-2xl font-bold`}>{count}</Text>
      <Text style={tw`text-white/80 text-sm mt-1`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Text>
    </TouchableOpacity>
  );
};

export default Subscriptions;