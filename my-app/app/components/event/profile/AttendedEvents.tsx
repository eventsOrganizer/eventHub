import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

interface Event {
  id: number;
  name: string;
  details: string;
  media: { url: string }[];
  subcategory: {
    name: string;
    category: {
      name: string;
    };
  };
  event_has_user: { user_id: string }[];
  availability: Array<{
    date: string;
    start: string;
    end: string;
  }>;
}

const AttendedEvents: React.FC = () => {
  const { userId } = useUser();
  const navigation = useNavigation<any>();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendedEvents = useCallback(async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('event_has_user')
        .select(`
          event:event_id (
            id,
            name,
            details,
            media (url),
            subcategory (
              name,
              category (
                name
              )
            ),
            event_has_user (user_id),
            availability (date, start, end)
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      setEvents(data?.map(item => item.event) || []);
    } catch (error) {
      console.error('Error fetching attended events:', error);
      Alert.alert('Error', 'Failed to load attended events');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAttendedEvents();
  }, [fetchAttendedEvents]);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="white" />
        <Text style={tw`text-white mt-4 text-lg font-medium`}>Loading attended events...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1`}>
    <View style={tw`px-4 pt-6 pb-20`}>
      <View style={tw`flex-row justify-between items-center mb-8`}>
        <View>
          <Text style={tw`text-white text-3xl font-bold`}>Your Attended Events</Text>
        </View>
      </View>
        {events.length === 0 ? (
          <BlurView intensity={80} tint="dark" style={tw`rounded-3xl p-8 items-center`}>
            <Ionicons name="calendar-outline" size={48} color="white" style={tw`mb-4 opacity-80`} />
            <Text style={tw`text-white text-xl font-bold mb-2`}>No Attended Events</Text>
            <Text style={tw`text-white/70 text-center mb-6`}>
              You haven't attended any events yet
            </Text>
          </BlurView>
        ) : (
          events.map((event) => (
            <BlurView 
              key={event.id} 
              intensity={80} 
              tint="dark" 
              style={tw`rounded-3xl mb-4 overflow-hidden border border-white/10`}
            >
              <TouchableOpacity 
                style={tw`p-4`}
                onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
              >
                <View style={tw`flex-row items-center`}>
                  <Image 
                    source={{ uri: event.media[0]?.url || 'https://via.placeholder.com/150' }}
                    style={tw`w-28 h-28 rounded-2xl mr-4`}
                  />
                  <View style={tw`flex-1 h-28 justify-between py-1`}>
                    <View>
                      <Text style={tw`text-white text-xl font-bold mb-1`}>{event.name}</Text>
                      <Text style={tw`text-white/60 text-sm mb-2`}>
                        {event.availability?.[0]?.date 
                          ? new Date(event.availability[0].date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : 'Date not set'}
                      </Text>
                    </View>
                    
                    <View>
                      <Text style={tw`text-white/50 text-xs mb-2`}>
                        {event.subcategory?.category?.name} • {event.subcategory?.name}
                      </Text>
                      <View style={tw`flex-row items-center`}>
                        <Ionicons name="people" size={16} color="white" />
                        <Text style={tw`text-white/80 text-sm ml-1`}>
                          {event.event_has_user?.length || 0} attendees
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </BlurView>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default AttendedEvents;