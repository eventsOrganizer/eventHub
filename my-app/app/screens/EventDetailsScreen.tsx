import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { supabase } from '../services/supabaseClient';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import EventMap from '../components/map/EventMap';
import AttendeesSection from '../components/event/AttendeesSection';
import PhotosSection from '../components/event/PhotosSection';
import CommentsSection from '../components/event/CommentsSection';
import styles from '../components/event/styles/eventDetailsStyles';
import JoinEventButton from '../components/event/JoinEventButton';
import UserAvatar from '../components/event/UserAvatar';
import EventLike from '../components/event/EventLike';
import EventReview from '../components/event/EventReview';
import BuyTicket from '../components/event/Ticketing/BuyTicket';
import VideoRoomControl from '../components/event/video/VideoRoomControl';

interface EventDetails {
  id: number;
  name: string;
  type: string;
  details: string;
  privacy: boolean;
  subcategory: {
    category: {
      name: string;
    };
    name: string;
  };
  media: { url: string }[];
  availability: Array<{
    date: string;
    start: string;
    end: string;
    daysofweek: string;
  }>;
  location: Array<{
    longitude: number;
    latitude: number;
  }>;
  user: {
    email: string;
    avatar_url?: string;
  } | null;
  user_id: string;
  address: string;
}

const EventDetailsScreen: React.FC<{ route: { params: { eventId: number } }, navigation: any }> = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('Loading address...');
  const [attendeesRefreshTrigger, setAttendeesRefreshTrigger] = useState(0);
  const [hasTickets, setHasTickets] = useState(false);

  useEffect(() => {
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
            media (url)
          `)
          .eq('id', eventId)
          .single();

        if (eventError) {
          console.error('Error fetching event details:', eventError);
          return;
        }

        if (eventData) {
          const { data: userData, error: userError } = await supabase
            .from('user')
            .select('email')
            .eq('id', eventData.user_id)
            .single();

          if (userError) {
            console.error('Error fetching user details:', userError);
          } else {
            eventData.user = {
              ...eventData.user,
              email: userData.email
            };
          }

          const { data: mediaData, error: mediaError } = await supabase
            .from('media')
            .select('url')
            .eq('user_id', eventData.user_id)
            .single();

          if (mediaError) {
            console.error('Error fetching user media:', mediaError);
          } else {
            eventData.user = {
              ...eventData.user,
              avatar_url: mediaData?.url || 'https://via.placeholder.com/150'
            };
          }

          setEventDetails(eventData);

          // Check if the event has tickets
          const { data: ticketData, error: ticketError } = await supabase
            .from('ticket')
            .select('id')
            .eq('event_id', eventId)
            .single();

          if (ticketError) {
            console.error('Error checking tickets:', ticketError);
          } else {
            setHasTickets(!!ticketData);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleJoinSuccess = () => {
    setAttendeesRefreshTrigger(prev => prev + 1);
  };

  const handleLeaveSuccess = () => {
    setAttendeesRefreshTrigger(prev => prev + 1);
  };

  if (!eventDetails) {
    return <View style={styles.loadingContainer}><Text style={styles.loadingText}>Loading...</Text></View>;
  }

  const openMap = () => {
    const latitude = eventDetails.location[0]?.latitude || 0;
    const longitude = eventDetails.location[0]?.longitude || 0;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <LinearGradient colors={['#000000', '#808080']} style={styles.container}>
      <ScrollView>
        <LinearGradient
          colors={['#FF8C00', '#FFA500']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientHeader}
        >
          <Text style={styles.eventName}>{eventDetails.name}</Text>
          
          {eventDetails.type === 'online' && (
  <VideoRoomControl
    eventId={eventDetails.id}
    eventType={eventDetails.type}
    organizerId={eventDetails.user_id}
    isPrivate={eventDetails.privacy}
  />
)}
<JoinEventButton
  eventId={eventDetails.id}
  privacy={eventDetails.privacy}
  organizerId={eventDetails.user_id}
  onJoinSuccess={handleJoinSuccess}
  onLeaveSuccess={handleLeaveSuccess}
/>
          <View style={styles.organizerContainer}>
            <UserAvatar userId={eventDetails.user_id} size={60} />
            <View>
              <Text style={styles.organizerLabel}>Organizer:</Text>
              <Text style={styles.organizerEmail}>{eventDetails.user?.email || 'Unknown'}</Text>
            </View>
          </View>
        </LinearGradient>

        <Image source={{ uri: eventDetails.media[0]?.url }} style={styles.eventImage} />

        <View style={styles.contentContainer}>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={24} color="#FF8C00" />
              <Text style={styles.infoText}>
                {eventDetails.availability[0]?.date || 'N/A'} | {eventDetails.availability[0]?.start || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="pricetag" size={24} color="#FF8C00" />
              <Text style={styles.infoText}>
                {eventDetails.subcategory.category.name} - {eventDetails.subcategory.name}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="business" size={24} color="#FF8C00" />
              <Text style={styles.infoText}>{eventDetails.type}</Text>
            </View>
          </View>

          {hasTickets && (
            <BuyTicket
              eventId={eventDetails.id}
              eventType={eventDetails.type as 'online' | 'indoor' | 'outdoor'}
            />
          )}

          <View style={styles.mapSection}>
            <View style={styles.mapInfo}>
              <Text style={styles.mapInfoTitle}>Address:</Text>
              <Text style={styles.mapInfoText}>{address}</Text>
              <Text style={styles.mapInfoTitle}>Distance:</Text>
              <Text style={styles.mapInfoText}>{distance ? `${distance.toFixed(2)} km` : 'Calculating...'}</Text>
              <TouchableOpacity style={styles.openMapButton} onPress={openMap}>
                <Text style={styles.openMapButtonText}>Open in Google Maps</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.mapContainer}>
              <EventMap
                eventLatitude={eventDetails.location[0]?.latitude || 0}
                eventLongitude={eventDetails.location[0]?.longitude || 0}
                onDistanceCalculated={setDistance}
                onAddressFound={setAddress}
              />
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Event Details</Text>
            <Text style={styles.details}>{eventDetails.details}</Text>
          </View>

          <View style={styles.sectionsContainer}>
            <AttendeesSection eventId={eventId} refreshTrigger={attendeesRefreshTrigger} />
            <PhotosSection eventId={eventId} />
            <CommentsSection eventId={eventId} />
          </View>
        </View>
        
        <EventLike eventId={eventId} />
        <EventReview eventId={eventId} />
      </ScrollView>
    </LinearGradient>
  );
};

export default EventDetailsScreen;