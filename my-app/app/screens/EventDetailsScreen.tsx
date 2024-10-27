import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
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

  const fetchEventDetails = async () => {
    try {
      const { data: eventData, error: eventError } = await supabase
      .from('event')
      .select(`
        *,
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
          quantity
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
    <LinearGradient colors={['#4B0082', '#0066CC']} style={tw`flex-1`}>
      <ScrollView>
        <LinearGradient colors={['#4B0082', '#0066CC']} style={tw`px-6 pt-6 pb-4 w-full`}>
          <Text style={tw`text-3xl font-bold text-white mb-2 shadow-lg`}>
            {eventDetails.name}
          </Text>
        </LinearGradient>
  
        <View style={tw`flex-row justify-between items-center px-4 py-4 bg-[#0066CC]/90`}>
          <View style={tw`flex-row items-center`}>
            <UserAvatar 
              userId={eventDetails.user_id} 
              size={60} 
              style={tw`border-2 border-white shadow-lg`}
            /> 
            <View style={tw`ml-3`}>
              <Text style={tw`text-sm text-white/90`}>Organized by</Text>
              <Text style={tw`text-base font-bold text-white`}>
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
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={tw`absolute bottom-0 w-full h-24`}
          />
          <View style={tw`absolute top-4 right-4 bg-white/90 rounded-full p-2 shadow-lg`}>
            <EventLike eventId={eventId} />
          </View>
        </View>
  
        <View style={tw`w-full -mt-2 px-4`}>
          <JoinEventButton
            eventId={eventDetails.id}
            privacy={eventDetails.privacy}
            organizerId={eventDetails.user_id}
            onJoinSuccess={handleJoinSuccess}
            onLeaveSuccess={handleLeaveSuccess}
          />
        </View>
  
        <View style={tw`w-full px-4 pb-4`}>
          <LinearGradient
            colors={['#4B0082', '#0066CC']}
            style={tw`p-4 rounded-xl mt-4 shadow-lg`}
          >
            <View style={tw`flex-row items-center mb-3`}>
              <Ionicons name="calendar" size={24} color="white" />
              <Text style={tw`text-base text-white ml-3 font-medium`}>
                {eventDetails.availability[0]?.date || 'N/A'} | {eventDetails.availability[0]?.start || 'N/A'}
              </Text>
            </View>
            <View style={tw`flex-row items-center mb-3`}>
              <Ionicons name="pricetag" size={24} color="white" />
              <Text style={tw`text-base text-white ml-3 font-medium`}>
                {eventDetails.subcategory.category.name} - {eventDetails.subcategory.name}
              </Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Ionicons name="business" size={24} color="white" />
              <Text style={tw`text-base text-white ml-3 font-medium`}>
                {eventDetails.type}
              </Text>
            </View>
          </LinearGradient>
  
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
  <View style={tw`mt-4`}>
    <LinearGradient
      colors={['#4B0082', '#0066CC']}
      style={tw`p-4 rounded-xl shadow-lg h-30 relative`}
    >
      <View style={tw`items-center`}>
        <View style={tw`flex-row items-center`}>
          <Ionicons name="ticket" size={24} color="white" />
          <Text style={tw`text-lg font-bold text-white ml-2`}>
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
    </LinearGradient>
  </View>
)}
  
          <LinearGradient
            colors={['#4B0082', '#0066CC']}
            style={tw`mt-4 rounded-xl overflow-hidden shadow-lg`}
          >
            <View style={tw`flex-row h-52`}>
              <View style={tw`p-4 flex-1`}>
                <Text style={tw`text-lg font-bold text-white mb-2`}>Location</Text>
                <Text style={tw`text-base text-white/90 mb-3`}>{address}</Text>
                <Text style={tw`text-lg font-bold text-white mb-2`}>Distance</Text>
                <Text style={tw`text-base text-white/90 mb-3`}>
                  {distance ? `${distance.toFixed(2)} km` : 'Calculating...'}
                </Text>
                <TouchableOpacity 
                  style={tw`bg-white/20 p-3 rounded-lg items-center mt-2`}
                  onPress={openMap}
                >
                  <Text style={tw`text-white font-bold`}>Open in Maps</Text>
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
          </LinearGradient>
  
          <LinearGradient
            colors={['#4B0082', '#0066CC']}
            style={tw`p-4 mt-4 rounded-xl shadow-lg`}
          >
            <Text style={tw`text-lg font-bold text-white mb-2`}>About this Event</Text>
            <Text style={tw`text-base text-white/90`}>
              {eventDetails.description || 'No description available.'}
            </Text>
          </LinearGradient>
  
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
    </LinearGradient>
  );
};

export default EventDetailsScreen;