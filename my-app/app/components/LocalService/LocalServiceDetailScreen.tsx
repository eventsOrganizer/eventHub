import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { supabase } from '../../services/supabaseClient';
import AvailabilityList from '../PersonalServiceComponents/AvailabilityList';
import CommentSection from '../PersonalServiceComponents/CommentSection';
import { initiatePayment } from '../../services/serviceTypes';


type RootStackParamList = {
  LocalServiceDetails: { localServiceId: number };
};

type LocalServiceDetailScreenRouteProp = RouteProp<RootStackParamList, 'LocalServiceDetails'>;

interface LocalService {
  id: number;
  name: string;
  details: string;
  priceperhour: number;
  media: { url: string }[];
  availability: any[];
  comment: any[];
}

const LocalServiceDetailScreen: React.FC = () => {
  const route = useRoute<LocalServiceDetailScreenRouteProp>();
  const navigation = useNavigation();
  const [service, setService] = useState<LocalService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

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
        availability={service.availability} 
        personalId={service.id} 
      />
      <CommentSection 
        comments={service.comment}
        personalId={service.id}
      />
      <TouchableOpacity 
        style={styles.bookButton} 
        onPress={handleBooking}
        disabled={isBooking}
      >
        <Text style={styles.bookButtonText}>
          {isBooking ? 'Processing...' : 'Book Now'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    color: 'green',
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    marginBottom: 20,
  },
  bookButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    margin: 20,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LocalServiceDetailScreen;