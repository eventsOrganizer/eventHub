import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { supabase } from '../services/supabaseClient';
import { Ionicons } from '@expo/vector-icons';
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
  } | null;
  user_id: string;
}

const EventDetailsScreen: React.FC<{ route: { params: { eventId: number } }, navigation: any }> = ({ route, navigation }) => {
  console.log('EventDetailsScreen rendered');
  const { eventId } = route.params;
  console.log('Event ID:', eventId);
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);

  useEffect(() => {
    console.log('useEffect triggered');
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    console.log('Fetching event details');
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
    
      console.log('Event data fetched:', eventData);
  
      if (eventData) {
        console.log('Fetching user details for user_id:', eventData.user_id);
        const { data: userData, error: userError } = await supabase
          .from('user')
          .select('email')
          .eq('id', eventData.user_id)
          .single();
    
        if (userError) {
          console.error('Error fetching user details:', userError);
          eventData.user = { email: 'Unknown' };
        } else if (userData) {
          console.log('User data fetched:', userData);
          eventData.user = userData;
        } else {
          console.log('No user found for the given user_id');
          eventData.user = { email: 'Unknown' };
        }
      }
    
      console.log('Setting event details:', eventData);
      setEventDetails(eventData);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  if (!eventDetails) {
    console.log('Event details not loaded yet');
    return <View style={styles.loadingContainer}><Text style={styles.loadingText}>Loading...</Text></View>;
  }

  console.log('Rendering event details');

  const openMap = () => {
    const latitude = eventDetails.location[0]?.latitude || 0;
    const longitude = eventDetails.location[0]?.longitude || 0;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    console.log('Opening map URL:', url);
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: eventDetails.media[0]?.url }} style={styles.image} />
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{eventDetails.name}</Text>
          <TouchableOpacity
            style={styles.organizerContainer}
            onPress={() => {
              console.log('Navigating to OrganizerProfile with ID:', eventDetails.user_id);
              navigation.navigate('OrganizerProfile', { organizerId: eventDetails.user_id });
            }}
          >
            <Text style={styles.organizerText}>Organizer: {eventDetails.user?.email || 'N/A'}</Text>
          </TouchableOpacity>
          <Text style={styles.date}>
            {eventDetails.availability[0]?.date || 'N/A'} | {eventDetails.availability[0]?.start || 'N/A'}
          </Text>
          <Text style={styles.eventType}>Event Type: {eventDetails.type}</Text>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <EventMap
          eventLatitude={eventDetails.location[0]?.latitude || 0}
          eventLongitude={eventDetails.location[0]?.longitude || 0}
        />
        <TouchableOpacity style={styles.openMapButton} onPress={openMap}>
          <Text style={styles.openMapButtonText}>Open in Google Maps</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Event Details</Text>
        <Text style={styles.details}>{eventDetails.details}</Text>
      </View>

      <View style={styles.categoryContainer}>
        <Ionicons name="pricetag-outline" size={20} color="#666" />
        <Text style={styles.category}>
          {eventDetails.subcategory.category.name} - {eventDetails.subcategory.name}
        </Text>
      </View>

      <AttendeesSection eventId={eventId} />
      <PhotosSection eventId={eventId} />
      <CommentsSection eventId={eventId} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  organizerContainer: {
    marginBottom: 5,
  },
  organizerText: {
    fontSize: 16,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  eventType: {
    fontSize: 16,
    color: '#666',
  },
  mapContainer: {
    height: 200,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  openMapButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
  },
  openMapButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  details: {
    fontSize: 16,
    color: '#333',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
});

export default EventDetailsScreen;