// EventSerialsList.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

const EventSerialsList: React.FC = () => {
  const [userEvents, setUserEvents] = useState([]);
  const { userId } = useUser();
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserEvents();
  }, [userId]);

  const fetchUserEvents = async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from('event')
      .select('id, name, serial, type')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user events:', error);
    } else {
      setUserEvents(data as any || []);
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`flex-row items-center p-4 border-b border-gray-200`}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={tw`mr-4`}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold`}>Your Event Serials</Text>
      </View>

      <ScrollView style={tw`flex-1`}>
        {userEvents.map((event: any) => (
          <TouchableOpacity
            key={event.id}
            style={tw`p-4 border-b border-gray-200`}
            onPress={() => {
              navigation.navigate('TicketScanning', { serial: event.serial });
            }}
          >
            <Text style={tw`text-lg font-bold`}>{event.name}</Text>
            <Text style={tw`text-gray-600`}>Serial: {event.serial}</Text>
            <Text style={tw`text-gray-600 capitalize`}>Type: {event.type}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default EventSerialsList;