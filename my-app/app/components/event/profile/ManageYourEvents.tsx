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
      // Check if event has tickets
      const { data: ticketData, error: ticketError } = await supabase
        .from('ticket')
        .select('id')
        .eq('event_id', eventId)
        .single();

      if (ticketError && ticketError.code !== 'PGRST116') throw ticketError;

      // If we found a ticket, check for orders
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
                  // Delete the event - cascading will handle related records
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

      // No tickets/orders - proceed with normal deletion
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
      <LinearGradient colors={['#4B0082', '#0066CC']} style={tw`flex-1 justify-center items-center`}>
        <BlurView intensity={80} tint="dark" style={tw`p-8 rounded-3xl`}>
          <ActivityIndicator size="large" color="white" />
          <Text style={tw`text-white mt-4 text-lg font-medium`}>Loading your events...</Text>
        </BlurView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#4B0082', '#0066CC']} style={tw`flex-1`}>
      <ScrollView style={tw`flex-1`}>
        <View style={tw`px-4 pt-6 pb-20`}>
          <View style={tw`flex-row justify-between items-center mb-8`}>
            <View>
              <Text style={tw`text-white/80 text-base mb-1`}>Your Events</Text>
              <Text style={tw`text-white text-3xl font-bold`}>Manage Events</Text>
            </View>
            <TouchableOpacity 
              style={tw`bg-white/20 p-4 rounded-2xl shadow-lg`}
              onPress={() => navigation.navigate('EventCreation')}
            >
              <Ionicons name="add" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {events.length === 0 ? (
            <BlurView intensity={80} tint="dark" style={tw`rounded-3xl p-8 items-center`}>
              <Ionicons name="calendar-outline" size={48} color="white" style={tw`mb-4 opacity-80`} />
              <Text style={tw`text-white text-xl font-bold mb-2`}>No Events Yet</Text>
              <Text style={tw`text-white/70 text-center mb-6`}>
                Start creating amazing events for your community
              </Text>
              <TouchableOpacity 
                style={tw`bg-white/20 px-6 py-3 rounded-xl`}
                onPress={() => navigation.navigate('EventCreation')}
              >
                <Text style={tw`text-white font-bold`}>Create Your First Event</Text>
              </TouchableOpacity>
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
                        <View style={tw`flex-row items-center justify-between`}>
                          <View style={tw`flex-row items-center`}>
                            <Ionicons name="people" size={16} color="white" />
                            <Text style={tw`text-white/80 text-sm ml-1`}>
                              {event.event_has_user?.length || 0} attendees
                            </Text>
                          </View>
                          <View style={tw`flex-row`}>
                            <TouchableOpacity 
                              style={tw`bg-white/20 p-2 rounded-xl mr-2`}
                              onPress={() => navigation.navigate('EditEvent', { eventId: event.id })}
                            >
                              <Ionicons name="pencil" size={20} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity 
                              style={tw`bg-red-500/20 p-2 rounded-xl`}
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
                  </View>
                </TouchableOpacity>
              </BlurView>
            ))
          )}
        </View>
      </ScrollView>

      {showDeleteModal && (
        <BlurView 
          intensity={90} 
          tint="dark" 
          style={tw`absolute inset-0 justify-center items-center px-6`}
        >
          <View style={tw`bg-white/10 p-6 rounded-3xl w-full max-w-sm`}>
            <Text style={tw`text-white text-xl font-bold mb-4 text-center`}>
              Delete Event?
            </Text>
            <Text style={tw`text-white/80 text-center mb-6`}>
              This action cannot be undone. All event data will be permanently removed.
            </Text>
            <View style={tw`flex-row justify-end`}>
              <TouchableOpacity
                style={tw`bg-white/20 px-6 py-3 rounded-xl mr-2`}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={tw`text-white font-bold`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-red-500 px-6 py-3 rounded-xl`}
                onPress={handleDeleteEvent}
              >
                <Text style={tw`text-white font-bold`}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      )}
    </LinearGradient>
  );
};

export default ManageYourEvents;