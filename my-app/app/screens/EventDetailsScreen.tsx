<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch, ScrollView, Alert } from 'react-native';

const EventDetailsScreen: React.FC = ({ route, navigation }: any) => {
  const { eventName, eventDescription, eventType } = route.params;

  // Additional Event Details States
  const [budget, setBudget] = useState<number>(0);
  const [calculatedCost, setCalculatedCost] = useState<number>(0);
  const [musicAndEntertainment, setMusicAndEntertainment] = useState(false);

  const calculateTotalCost = () => {
    let total = budget;
    if (musicAndEntertainment) {
      total += 150; // Example cost for music & entertainment
    }
    setCalculatedCost(total);
  };

  useEffect(() => {
    calculateTotalCost();
  }, [musicAndEntertainment, budget]);

  const handleNext = () => {
    // Pass event details and calculated cost to the MapScreen
    navigation.navigate('Map', {
      eventName,
      eventDescription,
      eventType,
      budget,
      calculatedCost,
      musicAndEntertainment
    });
  };

  const handleSubmit = () => {
    // Submit event details and navigate back or to another page
    Alert.alert('Event Created', `Your event "${eventName}" has been created!`);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <Text style={styles.header}>Event Details</Text>

      {/* Displaying Passed Data */}
      <Text style={styles.eventInfo}>Event Name: {eventName}</Text>
      <Text style={styles.eventInfo}>Event Description: {eventDescription}</Text>
      <Text style={styles.eventInfo}>Event Type: {eventType}</Text>

      {/* Budget Input */}
      <Text style={styles.label}>Event Budget</Text>
      <TextInput
        value={String(budget)}
        onChangeText={(text) => setBudget(Number(text))}
        style={styles.input}
        keyboardType="numeric"
        placeholder="Set your budget"
      />

      {/* Music & Entertainment Toggle */}
      <Text style={styles.label}>Music & Entertainment</Text>
      <Switch value={musicAndEntertainment} onValueChange={setMusicAndEntertainment} />
      <Text style={styles.switchLabel}>
        {musicAndEntertainment ? 'Music and Entertainment Included' : 'Music and Entertainment Not Included'}
      </Text>

      {/* Display Calculated Cost */}
      <Text style={styles.label}>Calculated Cost: ${calculatedCost}</Text>

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <Button title="Create Event" onPress={handleSubmit} />
      </View>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <Button title="Next: Choose Location" onPress={handleNext} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#4CAF50',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  switchLabel: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
  },
  eventInfo: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default EventDetailsScreen;
=======
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
    
        console.log('Event Data:', eventData);
    
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
    
          console.log('User Data:', userData);
    
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
    
          console.log('Media Data:', mediaData);
    
          if (mediaError) {
            console.error('Error fetching user media:', mediaError);
          } else {
            eventData.user = {
              ...eventData.user,
              avatar_url: mediaData?.url || 'https://via.placeholder.com/150'
            };
          }
        }
    
        console.log('Final Event Data:', eventData);
        setEventDetails(eventData);
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
      </ScrollView>
    </LinearGradient>
  );
};

export default EventDetailsScreen;
>>>>>>> 27016f8a9b04dc4f12ac01beefabdc660818306a
