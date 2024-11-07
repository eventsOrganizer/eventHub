import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, FlatList } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import EventReview from '../EventReview';
import UserAvatar from '../UserAvatar';

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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Date not set';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

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
            type,
            user_id,
            user:user_id (
              firstname,
              lastname
            ),
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

  const renderEvent = ({ item }: { item: Event }) => (
    <View style={tw`bg-white rounded-xl mb-4 shadow-sm border border-gray-100 overflow-hidden`}>
      <View style={tw`p-4`}>
        {/* Event Information */}
        <View style={tw`flex-row mb-4`}>
          <Image
            source={{ uri: item.media?.[0]?.url || 'https://via.placeholder.com/150' }}
            style={tw`w-28 h-28 rounded-xl mr-4`}
          />
          <View style={tw`flex-1 justify-between`}>
            <View>
              <Text style={tw`text-gray-800 text-xl font-bold mb-1`}>
                {item.name}
              </Text>
              <Text style={tw`text-gray-500 text-sm mb-2`}>
                {item.availability?.[0]?.date 
                  ? formatDate(item.availability[0].date)
                  : 'Date not set'}
              </Text>
              <Text style={tw`text-gray-400 text-xs`}>
                {item.subcategory?.category?.name || 'Category'} • 
                {item.subcategory?.name || 'Subcategory'}
              </Text>
            </View>
            <View style={tw`flex-row items-center justify-between`}>
              <View style={tw`flex-row items-center`}>
                <Ionicons 
                  name={item.type === 'online' ? 'laptop-outline' : 'location-outline'} 
                  size={16} 
                  color="#0066CC" 
                />
                <Text style={tw`text-gray-600 text-sm ml-1`}>
                  {item.type === 'online' ? 'Online Event' : 'Physical Event'}
                </Text>
              </View>
              <TouchableOpacity 
                style={tw`bg-blue-50 px-4 py-2 rounded-xl border border-blue-100`}
                onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
              >
                <Text style={tw`text-blue-600 font-medium`}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Organizer Information */}
        <View style={tw`bg-gray-50 rounded-xl p-4`}>
  <View style={tw`flex-row items-center`}>
    <UserAvatar 
      userId={item.user_id} // Changed to use the event creator's ID
      style={tw`w-12 h-12 rounded-full border-2 border-white shadow-sm`}
    />
    <View style={tw`ml-4 flex-1`}>
      <Text style={tw`text-gray-800 font-medium`}>Organized by</Text>
      <Text style={tw`text-gray-500 text-sm`}>
        {item.user?.firstname} {item.user?.lastname}
              </Text>
            </View>
            <EventReview eventId={item.id} showOnlyStars={true} />
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={tw`flex-1 bg-white justify-center items-center`}>
        <Text style={tw`text-gray-600 text-lg`}>Loading attended events...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <FlatList
        contentContainerStyle={tw`p-4`}
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={tw`bg-white rounded-3xl p-8 items-center border border-gray-100 shadow-sm`}>
            <Ionicons name="calendar-outline" size={48} color="#0066CC" style={tw`mb-4`} />
            <Text style={tw`text-gray-800 text-xl font-bold mb-2`}>No Attended Events</Text>
            <Text style={tw`text-gray-500 text-center`}>
              Events you've attended will appear here
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default AttendedEvents;