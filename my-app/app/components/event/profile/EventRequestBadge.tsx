import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';
import tw from 'twrnc';

const EventRequestBadge: React.FC = () => {
  const [requestCount, setRequestCount] = useState(0);
  const { userId } = useUser();
  const navigation = useNavigation();

  useEffect(() => {
    fetchEventRequestCount();
  }, [userId]);

  const fetchEventRequestCount = async () => {
    if (!userId) return;

    try {
      const { data: userEvents, error: eventError } = await supabase
        .from('event')
        .select('id')
        .eq('user_id', userId);

      if (eventError) throw eventError;

      if (userEvents && userEvents.length > 0) {
        const eventIds = userEvents.map(event => event.id);

        const { count, error } = await supabase
          .from('request')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending')
          .in('event_id', eventIds);

        if (error) throw error;

        setRequestCount(count || 0);
      } else {
        setRequestCount(0);
      }
    } catch (error) {
      console.error('Error fetching event request count:', error);
    }
  };

  const handlePress = () => {
    navigation.navigate('Requests' as never);
  };

  return (
    <TouchableOpacity
      style={tw`bg-[#5856D6] py-2 px-4 rounded-full shadow-md mr-2`}
      onPress={handlePress}
    >
      <Text style={tw`text-white text-xs font-bold`}>Requests ({requestCount})</Text>
    </TouchableOpacity>
  );
};

export default EventRequestBadge;