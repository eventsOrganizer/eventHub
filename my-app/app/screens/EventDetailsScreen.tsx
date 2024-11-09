import React, { useEffect, useState  } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { supabase } from '../services/supabaseClient';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import EventMap from '../components/map/EventMap';
import AttendeesSection from '../components/event/AttendeesSection';
import PhotosSection from '../components/event/PhotosSection';
import CommentsSection from '../components/event/CommentsSection';
import JoinEventButton from '../components/event/JoinEventButton';
import UserAvatar from '../components/event/UserAvatar';
import EventLike from '../components/event/EventLike';
import EventReview from '../components/event/EventReview';
import BuyTicket from '../components/event/Ticketing/BuyTicket';
import VideoRoomControl from '../components/event/video/VideoRoomControl';
import { useUser } from '../UserContext';
import tw from 'twrnc';
import BuyForFriends from '../components/event/Ticketing/BuyForFriends';

const EventDetailsScreen: React.FC<{ route: { params: { eventId: number } }, navigation: any }> = ({ route, navigation }) => {
  const { eventId } = route.params;
  const { userId } = useUser();
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('Loading address...');
  const [attendeesRefreshTrigger, setAttendeesRefreshTrigger] = useState(0);
  const [hasTickets, setHasTickets] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId, userId]);


  useFocusEffect(
    React.useCallback(() => {
      fetchEventDetails();
      return () => {
        // Optional cleanup if needed
      };
    }, [eventId, userId])
  );


  const fetchEventDetails = async () => {
    try {
      const { data: eventData, error: eventError } = await supabase
      .from('event')
      .select(`
        *,
      user:user_id (
        email
      ),
        subcategory (
          name,
          category (
            name
          )
        ),
        location (longitude, latitude),
        availability (date, start, end, daysofweek),
        media (url),
        ticket (
          id,
          quantity,
          price
        )
      `)
      .eq('id', eventId)
      .single();

      if (eventError) throw eventError;

      setEventDetails(eventData);
      setIsOrganizer(eventData.user_id === userId);

      if (eventData.privacy) {
        const { data: memberData } = await supabase
          .from('event_has_user')
          .select('user_id')
          .eq('event_id', eventId)
          .eq('user_id', userId)
          .single();

        setIsMember(!!memberData);
      } else {
        setIsMember(true);
      }

      const { data: ticketData } = await supabase
        .from('ticket')
        .select('id')
        .eq('event_id', eventId)
        .single();

      setHasTickets(!!ticketData);
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  // useEffect(() => {
  //   if (!eventId) return;
  
  //   const channel = supabase
  //     .channel(`videoroom_status_${eventId}`)
  //     .on(
  //       'postgres_changes',
  //       {
  //         event: '*',
  //         schema: 'public',
  //         table: 'videoroom',
  //         filter: `event_id=eq.${eventId}`
  //       },
  //       () => {
  //         fetchEventDetails();
  //       }
  //     )
  //     .subscribe();
  
  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, [eventId]);

  const handleJoinSuccess = () => {
    setAttendeesRefreshTrigger(prev => prev + 1);
    setIsMember(true);
  };

  const handleLeaveSuccess = () => {
    setAttendeesRefreshTrigger(prev => prev + 1);
    setIsMember(false);
  };

  const openMap = () => {
    const latitude = eventDetails?.location[0]?.latitude || 0;
    const longitude = eventDetails?.location[0]?.longitude || 0;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  if (!eventDetails) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <Text style={tw`text-[#4B0082] text-lg`}>Loading...</Text>
      </View>
    );
  }

return (
  <View style={tw`flex-1 bg-white`}>
    <ScrollView>
      <LinearGradient 
        colors={['#E8F0FE', '#F8FAFF']} 
        style={tw`px-6 pt-6 pb-4 w-full shadow-sm border-b border-gray-100`}
      >
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-3xl font-bold text-blue-800 mb-2 flex-1`}>
            {eventDetails.name}
          </Text>
          {eventDetails.user_id === userId && (
            <TouchableOpacity 
              style={tw`ml-3 bg-blue-50 p-2 rounded-full`}
              onPress={() => navigation.navigate('EditEvent', { eventId: eventDetails.id })}
            >
              <Ionicons name="pencil" size={24} color="#0066CC" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <View style={tw`flex-row justify-between items-center px-4 py-4 bg-gray-50`}>
        <View style={tw`flex-row items-center`}>
          <UserAvatar 
            userId={eventDetails.user_id} 
            size={60} 
            style={tw`border-2 border-white shadow-md`}
          />
          <View style={tw`ml-3`}>
            <Text style={tw`text-sm text-gray-500`}>Organized by</Text>
            <Text style={tw`text-base font-bold text-gray-800`}>
              {eventDetails.user?.email || 'Unknown'}
            </Text>
          </View>
        </View>
        <View style={tw`flex-1 ml-4`}>
          <EventReview eventId={eventId} showOnlyInput={true} />
        </View>
      </View>

      <View style={tw`relative w-full h-96`}>
        <Image 
          source={{ uri: eventDetails.media[0]?.url }} 
          style={tw`w-full h-full`}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.9)']}
          style={tw`absolute bottom-0 w-full h-24`}
        />
        <View style={tw`absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg`}>
          <EventLike eventId={eventId} />
        </View>
      </View>

      <View style={tw`w-full -mt-2 px-4`}>
        {eventDetails.user_id !== userId && (
          <JoinEventButton
            eventId={eventDetails.id}
            privacy={eventDetails.privacy}
            organizerId={eventDetails.user_id}
            onJoinSuccess={handleJoinSuccess}
            onLeaveSuccess={handleLeaveSuccess}
          />
        )}
      </View>

      <View style={tw`w-full px-4 pb-4`}>
        <View style={tw`bg-white rounded-xl mt-4 shadow-sm border border-gray-100 p-4`}>
          <View style={tw`flex-row items-center mb-3`}>
            <Ionicons name="calendar" size={24} color="#0066CC" />
            <Text style={tw`text-base text-gray-700 ml-3 font-medium`}>
              {eventDetails.availability[0]?.date || 'N/A'} | {eventDetails.availability[0]?.start || 'N/A'}
            </Text>
          </View>
          <View style={tw`flex-row items-center mb-3`}>
            <Ionicons name="pricetag" size={24} color="#0066CC" />
            <Text style={tw`text-base text-gray-700 ml-3 font-medium`}>
              {eventDetails.subcategory.category.name} - {eventDetails.subcategory.name}
            </Text>
            <View style={tw`flex-1 items-end`}>
              {eventDetails.ticket?.[0] ? (
                <View style={tw`bg-blue-50 px-5 py-1 rounded-md border border-blue-100 flex-row items-center`}>
                  <Text style={tw`text-base text-blue-600 font-bold`}>
                    ${eventDetails.ticket[0].price}
                  </Text>
                  <Text style={tw`text-sm text-blue-400 ml-1`}>
                    ({eventDetails.ticket[0].quantity})
                  </Text>
                </View>
              ) : (
                <View style={tw`bg-green-50 px-3 py-1 rounded-md border border-green-100`}>
                  <Text style={tw`text-base text-green-600 font-bold`}>
                    FREE
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View style={tw`flex-row items-center`}>
            <Ionicons name="business" size={24} color="#0066CC" />
            <Text style={tw`text-base text-gray-700 ml-3 font-medium`}>
              {eventDetails.type}
            </Text>
          </View>
        </View>

        {eventDetails.type === 'online' && (
          <View style={tw`mt-4`}>
            <VideoRoomControl
              eventId={eventDetails.id}
              eventType={eventDetails.type}
              organizerId={eventDetails.user_id}
              isPrivate={eventDetails.privacy}
            />
          </View>
        )}

        {(hasTickets && (isMember || isOrganizer)) && (
          <View style={tw`mt-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-30 relative`}>
            <View style={tw`items-center`}>
              <View style={tw`flex-row items-center`}>
                <Ionicons name="ticket" size={24} color="#0066CC" />
                <Text style={tw`text-lg font-bold text-gray-800 ml-2`}>
                  {eventDetails.ticket?.[0]?.quantity || 0} Tickets Available
                </Text>
              </View>
            </View>
            <View style={tw`absolute bottom-4 left-22 right-22 flex-row items-center justify-center space-x-2`}>
              <BuyTicket
                eventId={eventDetails.id}
                eventType={eventDetails.type as 'online' | 'indoor' | 'outdoor'}
              />
              <BuyForFriends
                eventId={eventDetails.id}
                eventType={eventDetails.type as 'online' | 'indoor' | 'outdoor'}
              />
            </View>
          </View>
        )}

        <View style={tw`bg-white rounded-xl mt-4 shadow-sm border border-gray-100 overflow-hidden`}>
          <View style={tw`flex-row h-52`}>
            <View style={tw`p-4 flex-1`}>
              <View style={tw`h-36`}>
                <Text style={tw`text-lg font-bold text-gray-800 mb-1`}>Location</Text>
                <Text 
                  style={tw`text-base text-gray-600 mb-1`}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {address}
                </Text>
                <Text style={tw`text-lg font-bold text-gray-800 mb-1`}>Distance</Text>
                <Text 
                  style={tw`text-base text-gray-600`}
                  numberOfLines={1}
                >
                  {distance ? `${distance.toFixed(2)} km` : 'Calculating...'}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={tw`bg-blue-50 p-2 rounded-lg items-center`}
                onPress={openMap}
              >
                <Text style={tw`text-blue-600 font-bold`}>Open in Maps</Text>
              </TouchableOpacity>
            </View>
            <View style={tw`flex-1`}>
              <EventMap
                eventLatitude={eventDetails.location[0]?.latitude || 0}
                eventLongitude={eventDetails.location[0]?.longitude || 0}
                onDistanceCalculated={setDistance}
                onAddressFound={setAddress}
              />
            </View>
          </View>
        </View>

        <View style={tw`bg-white rounded-xl mt-4 shadow-sm border border-gray-100 p-4`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>About this Event</Text>
          <Text style={tw`text-base text-gray-600`}>
            {eventDetails.details || 'No description available.'}
          </Text>
        </View>

        <AttendeesSection
          eventId={eventId}
          refreshTrigger={attendeesRefreshTrigger}
          isOrganizer={isOrganizer}
          userId={userId}
        />

        <PhotosSection eventId={eventId} />

        <CommentsSection eventId={eventId} />
      </View>
    </ScrollView>
  </View>
);
};

export default EventDetailsScreen;