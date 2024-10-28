import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { LinearGradient } from 'expo-linear-gradient';
import UserAvatar from './UserAvatar';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

interface AttendeesSectionProps {
  eventId: number;
  refreshTrigger: number;
}

interface Attendee {
  id: string;
}

const AttendeesSection: React.FC<AttendeesSectionProps> = ({ eventId, refreshTrigger }) => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    fetchAttendees();
  }, [refreshTrigger]);

  const fetchAttendees = async () => {
    const { data, error } = await supabase
      .from('event_has_user')
      .select('user_id')
      .eq('event_id', eventId);

    if (error) {
      console.error('Error fetching attendees:', error);
      return;
    }

    setAttendees(data.map(item => ({ id: item.user_id })));
  };

  const renderAttendee = ({ item }: { item: Attendee }) => (
    <View style={tw`mr-3`}>
      <UserAvatar 
        userId={item.id} 
        size={50} 
        style={tw`border-2 border-white shadow-lg`}
      />
    </View>
  );

  return (
    <LinearGradient
      colors={['#4B0082', '#0066CC']}
      style={tw`p-4 rounded-xl mt-4 shadow-lg`}
    >
      <View style={tw`flex-row items-center mb-4`}>
        <Ionicons name="people" size={24} color="white" />
        <Text style={tw`text-lg font-bold text-white ml-2`}>
          Attendees ({attendees.length})
        </Text>
      </View>
      <FlatList
        data={attendees}
        renderItem={renderAttendee}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`py-2`}
      />
    </LinearGradient>
  );
};

export default AttendeesSection;