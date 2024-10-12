import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { supabase } from '../services/supabaseClient';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

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

const EventDetailsScreen: React.FC<{ route: { params: { eventId: number } } }> = ({ route }) => {
  const { eventId } = route.params;
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);

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
    }
  
    console.log('Fetched event details:', JSON.stringify(eventData, null, 2));
    setEventDetails(eventData);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};


    fetchEventDetails();
  }, [eventId]);

  if (!eventDetails) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: eventDetails.media[0]?.url }} style={styles.image} />
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: eventDetails.location[0]?.latitude || 0,
            longitude: eventDetails.location[0]?.longitude || 0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: eventDetails.location[0]?.latitude || 0,
              longitude: eventDetails.location[0]?.longitude || 0,
            }}
          />
        </MapView>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{eventDetails.name}</Text>
        <Text style={styles.category}>
          {eventDetails.subcategory.category.name} - {eventDetails.subcategory.name}
        </Text>
        <View style={styles.organizerInfo}>
          <Ionicons name="person-outline" size={20} color="#666" />
          <Text style={styles.organizer}>Organizer: {eventDetails.user?.email || 'N/A'}</Text>
        </View>
        <View style={styles.dateTimeInfo}>
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <Text style={styles.dateTime}>
            {eventDetails.availability[0]?.date || 'N/A'} | {eventDetails.availability[0]?.start || 'N/A'} - {eventDetails.availability[0]?.end || 'N/A'}
          </Text>
        </View>
        <View style={styles.locationInfo}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <Text style={styles.location}>
            Latitude: {eventDetails.location[0]?.latitude || 'N/A'}, Longitude: {eventDetails.location[0]?.longitude || 'N/A'}
          </Text>
        </View>
        <Text style={styles.details}>{eventDetails.details}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    height: 200,
  },
  image: {
    flex: 1,
    height: '100%',
  },
  map: {
    flex: 1,
    height: '100%',
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  category: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  organizerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  organizer: {
    fontSize: 16,
    marginLeft: 10,
  },
  dateTimeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateTime: {
    fontSize: 16,
    marginLeft: 10,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  location: {
    fontSize: 16,
    marginLeft: 10,
  },
  details: {
    fontSize: 16,
  },
});

export default EventDetailsScreen;