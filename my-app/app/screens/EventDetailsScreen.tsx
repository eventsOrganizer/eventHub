import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { supabase } from '../services/supabaseClient';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import EventMap from '../components/map/EventMap';
import AttendeesSection from '../components/event/AttendeesSection';
import PhotosSection from '../components/event/PhotosSection';
import CommentsSection from '../components/event/CommentsSection';

interface EventDetails {
  id: number;
  name: string;
  type: string;
  details: string;
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

const { width: screenWidth } = Dimensions.get('window');

const EventDetailsScreen: React.FC<{ route: { params: { eventId: number } }, navigation: any }> = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('Loading address...');

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
            eventData.user = userData;
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
        }

        setEventDetails(eventData);
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

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
    <LinearGradient
      colors={['#000000', '#808080']}
      style={styles.container}
    >
      <ScrollView>
        <LinearGradient
          colors={['#FF8C00', '#FFA500']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientHeader}
        >
          <Text style={styles.eventName}>{eventDetails.name}</Text>
          <TouchableOpacity
            style={styles.organizerContainer}
            onPress={() => navigation.navigate('OrganizerProfile', { organizerId: eventDetails.user_id })}
          >
            <Image 
              source={{ uri: eventDetails.user?.avatar_url || 'https://via.placeholder.com/150' }} 
              style={styles.organizerAvatar} 
            />
            <View>
              <Text style={styles.organizerLabel}>Organizer:</Text>
              <Text style={styles.organizerEmail}>{eventDetails.user?.email || 'Unknown'}</Text>
            </View>
          </TouchableOpacity>
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
            <AttendeesSection eventId={eventId} />
            <PhotosSection eventId={eventId} />
            <CommentsSection eventId={eventId} />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: 18,
    color: '#FF8C00',
  },
  gradientHeader: {
    padding: 20,
    paddingTop: 60,
    width: screenWidth,
  },
  eventName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  organizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  organizerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  organizerLabel: {
    fontSize: 14,
    color: '#FFF3E0',
  },
  organizerEmail: {
    fontSize: 18,
    color: '#FFF3E0',
    fontWeight: 'bold',
  },
  eventImage: {
    width: screenWidth,
    height: 250,
    resizeMode: 'cover',
  },
  contentContainer: {
    width: screenWidth,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    marginTop: -20,
    width: screenWidth,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  mapSection: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    overflow: 'hidden',
    width: screenWidth,
    flexDirection: 'row',
    height: 200,
  },
  mapInfo: {
    padding: 20,
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  mapInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 5,
  },
  mapInfoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  openMapButton: {
    backgroundColor: 'rgba(255, 140, 0, 0.8)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  openMapButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginTop: 20,
    borderRadius: 10,
    width: screenWidth,
  },
  sectionsContainer: {
    marginTop: 20,
    width: screenWidth,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF8C00',
  },
  details: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});

export default EventDetailsScreen;