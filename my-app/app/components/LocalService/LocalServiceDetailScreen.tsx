import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { supabase } from '../../services/supabaseClient';
import AvailabilityList from '../PersonalServiceComponents/AvailabilityList';
import CommentSection from '../PersonalServiceComponents/CommentSection';
import useStripePayment from '../../payment/UseStripePayment'; // Import the custom hook

type RootStackParamList = {
  LocalServiceDetails: { localServiceId: number };
  PaymentAction: { price: number; personalId: string };
};

type LocalServiceDetailScreenRouteProp = RouteProp<RootStackParamList, 'LocalServiceDetails'>;

interface Media {
  url: string;
}

interface Availability {
  id: number;
  start: string;
  end: string;
  daysofweek: string[];
  date: string;
}

interface Comment {
  id: number;
  details: string;
  user_id: string;
  created_at: string;
}

interface LocalService {
  id: number;
  name: string;
  details: string;
  priceperhour: number;
  media: Media[];
  availability: Availability[];
  comment: Comment[];
  userId: string;
}

const LocalServiceDetailScreen: React.FC = () => {
  const route = useRoute<LocalServiceDetailScreenRouteProp>();
  const navigation = useNavigation();
  const [service, setService] = useState<LocalService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handlePayment, loading } = useStripePayment(); // Use the custom hook

  useEffect(() => {
    const fetchServiceDetails = async () => {
      const localServiceId = route.params?.localServiceId;
      console.log('Fetching service details for id:', localServiceId);

      if (!localServiceId) {
        setError('No service ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('local')
          .select(`
            *,
            media (url),
            availability (id, start, end, daysofweek, date),
            comment (id, details, user_id, created_at)
          `)
          .eq('id', localServiceId)
          .single();

        if (error) throw error;
        if (!data) throw new Error('No data returned from the query');

        console.log('Fetched service data:', data);
        setService(data);
      } catch (error) {
        console.error('Error fetching service details:', error);
        setError('Failed to load service details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceDetails();
  }, [route.params?.localServiceId]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    Alert.alert('Error', error); // Display error alert
    return (
      <View style={styles.container}>
        <Text>No service details available.</Text>
      </View>
    );
  }

  if (!service) {
    return (
      <View style={styles.container}>
        <Text>No service details available.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: service.media[0]?.url }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.price}>${service.priceperhour}/hr</Text>
        <Text style={styles.details}>{service.details}</Text>
      </View>
      <AvailabilityList 
        availability={service.availability.map(item => ({
          ...item,
          daysofweek: Array.isArray(item.daysofweek) ? item.daysofweek.join(', ') : 'N/A'
        }))} 
        personalId={service.id} 
      />
      <CommentSection 
        comments={service.comment}
        personalId={service.id}
        userId={service.userId}
      />
      <TouchableOpacity 
        style={styles.bookButton} 
        onPress={() => handlePayment(service.id.toString(), service.priceperhour)}
        disabled={loading}
      >
        <Text style={styles.bookButtonText}>{loading ? 'Processing...' : 'Book Now'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Softer background color for a modern feel
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Center the loading indicator vertically and horizontally
  },
  image: {
    width: '100%',
    height: 250, // Slightly larger image to display more of the media
    resizeMode: 'cover', // Maintain aspect ratio while filling the area
    borderBottomLeftRadius: 20, // Rounded corners for the image
    borderBottomRightRadius: 20,
    marginBottom: 20, // Space between the image and the content below
  },
  infoContainer: {
    paddingHorizontal: 16, // Reduced padding for a more compact look
    paddingBottom: 20, // Extra padding at the bottom of the info section
  },
  name: {
    fontSize: 26, // Slightly larger font size for the name
    fontWeight: 'bold',
    color: '#333', // Darker color for better contrast
    marginBottom: 10,
  },
  price: {
    fontSize: 20, // Increased size to emphasize the price
    color: 'green', // Keep the price green for easy recognition
    marginBottom: 15, // Increased margin for better spacing
  },
  details: {
    fontSize: 16,
    color: '#666', // Lighter color for secondary information
    lineHeight: 24, // Improve readability by increasing line height
  },
  bookButton: {
    backgroundColor: '#007AFF', // Vibrant blue color for the button
    paddingVertical: 15, // Increase vertical padding for a larger touch target
    borderRadius: 25, // Fully rounded button for a more modern look
    alignItems: 'center',
    marginHorizontal: 40, // Add horizontal margin for centering and balance
    marginBottom: 30, // Extra bottom margin for spacing
    elevation: 3, // Add shadow for a raised button effect on Android
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold', // Emphasize the button text
  },
});

export default LocalServiceDetailScreen;