import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import tw from 'twrnc';

interface Event {
  id: number;
  name: string;
  details: string;
  date: string;
  user_id: string;
  media: { url: string }[];
  subcategory: {
    name: string;
    category: {
      name: string;
    };
  };
  event_has_user: { user_id: string }[];
}

const ManageYourEvents: React.FC = () => {
  const { userId } = useUser();
  const navigation = useNavigation<any>();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('event')
        .select(`
          *,
          media (url),
          subcategory (
            name,
            category (
              name
            )
          ),
          event_has_user (user_id)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      
      console.log('Events data:', data); // For debugging
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-blue-900`}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#1E3A8A', '#3B82F6', '#93C5FD']}
      style={tw`flex-1`}
    >
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4`}>
        <View style={tw`flex-row justify-between items-center mb-6`}>
          <Text style={tw`text-white text-2xl font-bold`}>Manage Your Events</Text>
          <TouchableOpacity 
            style={tw`bg-white/20 p-2 rounded-full`}
            onPress={() => navigation.navigate('EventCreation')}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {events.length === 0 ? (
          <BlurView intensity={80} tint="dark" style={tw`rounded-xl p-4`}>
            <Text style={tw`text-white text-center text-lg`}>No events found</Text>
          </BlurView>
        ) : (
          events.map((event) => (
            <BlurView 
              key={event.id} 
              intensity={80} 
              tint="dark" 
              style={tw`rounded-xl mb-4 overflow-hidden`}
            >
              <TouchableOpacity 
                style={tw`p-4`}
                onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
              >
                <View style={tw`flex-row`}>
                  <Image 
                    source={{ uri: event.media[0]?.url || 'https://via.placeholder.com/150' }}
                    style={tw`w-24 h-24 rounded-lg mr-4`}
                  />
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-white text-xl font-bold mb-1`}>{event.name}</Text>
                    <Text style={tw`text-white/80 text-sm mb-2`}>
                      {new Date(event.date).toLocaleDateString()}
                    </Text>
                    <Text style={tw`text-white/70 text-xs mb-2`}>
                      {event.subcategory?.category?.name} • {event.subcategory?.name}
                    </Text>
                    <View style={tw`flex-row items-center`}>
                      <Ionicons name="people" size={16} color="white" />
                      <Text style={tw`text-white/80 text-sm ml-1`}>
                        {event.event_has_user?.length || 0} attendees
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity 
  style={tw`justify-center`}
  onPress={() => navigation.navigate('EditEvent', { eventId: event.id })}
>
  <Ionicons name="pencil" size={24} color="white" />
</TouchableOpacity>
                </View>
              </TouchableOpacity>
            </BlurView>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default ManageYourEvents;