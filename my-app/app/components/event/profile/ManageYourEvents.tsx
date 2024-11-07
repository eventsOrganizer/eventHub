import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
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
  user_id: string;
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

const ManageYourEvents: React.FC = () => {
  const { userId } = useUser();
  const navigation = useNavigation<any>();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

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
          event_has_user (user_id),
          availability (date, start, end)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      Alert.alert('Error', 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const checkTicketsAndOrders = async (eventId: number) => {
    try {
      const { data: ticketData, error: ticketError } = await supabase
        .from('ticket')
        .select('id')
        .eq('event_id', eventId)
        .single();

      if (ticketError && ticketError.code !== 'PGRST116') throw ticketError;

      if (ticketData) {
        const { data: orderData, error: orderError } = await supabase
          .from('order')
          .select('id')
          .eq('ticket_id', ticketData.id);

        if (orderError) throw orderError;
        return { hasOrders: orderData && orderData.length > 0, ordersCount: orderData?.length || 0 };
      }

      return { hasOrders: false, ordersCount: 0 };
    } catch (error) {
      console.error('Error checking tickets and orders:', error);
      throw error;
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEventId) return;
    
    try {
      const { hasOrders, ordersCount } = await checkTicketsAndOrders(selectedEventId);

      if (hasOrders) {
        Alert.alert(
          'Warning',
          `This event has ${ordersCount} paid tickets. Deleting it will require refunds.`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => {
                setShowDeleteModal(false);
                setSelectedEventId(null);
              }
            },
            {
              text: 'Proceed with Refunds',
              style: 'destructive',
              onPress: async () => {
                try {
                  const { error: deleteError } = await supabase
                    .from('event')
                    .delete()
                    .eq('id', selectedEventId);

                  if (deleteError) throw deleteError;

                  setEvents(events.filter(event => event.id !== selectedEventId));
                  setShowDeleteModal(false);
                  setSelectedEventId(null);
                  Alert.alert('Success', `Event deleted and ${ordersCount} refunds will be processed.`);
                } catch (error) {
                  console.error('Error deleting event:', error);
                  Alert.alert('Error', 'Failed to delete event');
                }
              }
            }
          ]
        );
        return;
      }

      const { error: deleteError } = await supabase
        .from('event')
        .delete()
        .eq('id', selectedEventId);

      if (deleteError) throw deleteError;
      
      setEvents(events.filter(event => event.id !== selectedEventId));
      setShowDeleteModal(false);
      setSelectedEventId(null);
      Alert.alert('Success', 'Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      Alert.alert('Error', 'Failed to delete event');
    }
  };

  if (loading) {
    return (
      <View style={tw`flex-1 bg-white justify-center items-center`}>
        <View style={tw`bg-white p-8 rounded-3xl shadow-sm border border-gray-100`}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={tw`text-gray-600 mt-4 text-lg font-medium`}>Loading your events...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1`}>
        <View style={tw`px-4 pt-6 pb-20`}>
          <View style={tw`flex-row justify-between items-center mb-8`}>
            <Text style={tw`text-blue-800 text-3xl font-bold`}>Your Events</Text>
            <TouchableOpacity 
              style={tw`bg-blue-50 p-4 rounded-2xl shadow-sm border border-blue-100`}
              onPress={() => navigation.navigate('EventCreation')}
            >
              <Ionicons name="add" size={28} color="#0066CC" />
            </TouchableOpacity>
          </View>

          {/* Empty state */}
          {events.length === 0 ? (
            <View style={tw`bg-white rounded-3xl p-8 items-center border border-gray-100 shadow-sm`}>
              <Ionicons name="calendar-outline" size={48} color="#0066CC" style={tw`mb-4`} />
              <Text style={tw`text-gray-800 text-xl font-bold mb-2`}>No Events Yet</Text>
              <Text style={tw`text-gray-500 text-center mb-6`}>
                Start creating amazing events for your community
              </Text>
              <TouchableOpacity 
                style={tw`bg-blue-50 px-6 py-3 rounded-xl border border-blue-100`}
                onPress={() => navigation.navigate('EventCreation')}
              >
                <Text style={tw`text-blue-600 font-bold`}>Create Your First Event</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Event cards
            events.map((event) => (
              <View 
                key={event.id}
                style={tw`bg-white rounded-3xl mb-4 overflow-hidden border border-gray-100 shadow-sm`}
              >
                <TouchableOpacity 
                  style={tw`p-4`}
                  onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
                >
                  <View style={tw`flex-row h-32`}>
                    <Image 
                      source={{ uri: event.media[0]?.url || 'https://via.placeholder.com/150' }}
                      style={tw`w-32 h-32 rounded-xl mr-4`}
                    />
                    <View style={tw`flex-1 justify-between py-1`}>
                      {/* Top Section */}
                      <View style={tw`flex-1`}>
                        <Text 
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={tw`text-gray-800 text-xl font-bold`}
                        >
                          {event.name}
                        </Text>
                        <Text 
                          numberOfLines={1} 
                          style={tw`text-gray-500 text-sm mt-1`}
                        >
                          {event.availability?.[0]?.date 
                            ? new Date(event.availability[0].date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })
                            : 'Date not set'}
                        </Text>
                      </View>
                      
                      {/* Middle Section */}
                      <View style={tw`flex-1 justify-center`}>
                        <Text 
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={tw`text-gray-400 text-xs`}
                        >
                          {event.subcategory?.category?.name} • {event.subcategory?.name}
                        </Text>
                      </View>

                      {/* Bottom Section */}
                      <View style={tw`flex-row items-center justify-between`}>
                        <View style={tw`flex-row items-center flex-1`}>
                          <Ionicons name="people" size={16} color="#0066CC" />
                          <Text 
                            numberOfLines={1}
                            style={tw`text-gray-600 text-sm ml-1 flex-1`}
                          >
                            {event.event_has_user?.length || 0} attendees
                          </Text>
                        </View>
                        <View style={tw`flex-row ml-2`}>
                          <TouchableOpacity 
                            style={tw`bg-blue-50 p-2 rounded-xl mr-2 border border-blue-100`}
                            onPress={() => navigation.navigate('EditEvent', { eventId: event.id })}
                          >
                            <Ionicons name="pencil" size={20} color="#0066CC" />
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={tw`bg-red-50 p-2 rounded-xl border border-red-100`}
                            onPress={() => {
                              setSelectedEventId(event.id);
                              setShowDeleteModal(true);
                            }}
                          >
                            <Ionicons name="trash" size={20} color="#ef4444" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Delete Modal */}
      {showDeleteModal && (
        <View style={tw`absolute inset-0 bg-black/50 justify-center items-center px-6`}>
          <View style={tw`bg-white p-6 rounded-3xl w-full max-w-sm shadow-lg`}>
            <Text style={tw`text-gray-800 text-xl font-bold mb-4 text-center`}>
              Delete Event?
            </Text>
            <Text style={tw`text-gray-600 text-center mb-6`}>
              This action cannot be undone. All event data will be permanently removed.
            </Text>
            <View style={tw`flex-row justify-end`}>
              <TouchableOpacity
                style={tw`bg-gray-100 px-6 py-3 rounded-xl mr-2`}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={tw`text-gray-600 font-bold`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-red-500 px-6 py-3 rounded-xl`}
                onPress={handleDeleteEvent}
              >
                <Text style={tw`text-white font-bold`}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ManageYourEvents;