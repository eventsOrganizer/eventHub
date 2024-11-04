import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';
import { format, parseISO } from 'date-fns';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import ProgressBar from '../reuseableForCreationService/ProgressBar';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Location {
  latitude: number;
  longitude: number;
}

type RouteParams = {
  serviceName: string;
  description: string;
  images: string[];
  price: string;
  subcategoryId: string;
  subcategoryName: string;
  startDate: string;
  endDate: string;
  interval: string;
  exceptionDates: string[];
  location: Location;
  amenities: {
    wifi: boolean;
    parking: boolean;
    aircon: boolean;
  };
};

const CreateLocalServiceStep5: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const { userId } = useUser();
  const { 
    serviceName, 
    description, 
    images, 
    price,
    subcategoryId,
    subcategoryName,
    startDate,
    endDate,
    interval,
    exceptionDates = [],
    location,
    amenities
  } = route.params;

  const handleConfirm = async () => {
    try {
      if (!userId) {
        Alert.alert('Error', 'You must be logged in to create a service');
        return;
      }

      // Create local service
      const { data: localData, error: localError } = await supabase
        .from('local')
        .insert({
          name: serviceName,
          details: description,
          price: parseFloat(price),
          subcategory_id: subcategoryId,
          user_id: userId,
          startdate: startDate,
          enddate: endDate,
          interval: interval
        })
        .select()
        .single();

      if (localError) throw localError;

      // Insert availability data
      const availabilityData = exceptionDates.map(dateString => ({
        local_id: localData.id,
        date: dateString,
        startdate: startDate,
        enddate: endDate,
        daysofweek: format(parseISO(dateString), 'EEEE').toLowerCase(),
        statusday: 'exception'
      }));

      if (availabilityData.length > 0) {
        const { error: availabilityError } = await supabase
          .from('availability')
          .insert(availabilityData);

        if (availabilityError) throw availabilityError;
      }

      // Insert location
      if (location) {
        const { error: locationError } = await supabase
          .from('location')
          .insert({
            latitude: location.latitude,
            longitude: location.longitude,
            local_id: localData.id
          });

        if (locationError) throw locationError;
      }

      // Insert amenities
      const { error: amenitiesError } = await supabase
        .from('amenities')
        .insert({
          local_id: localData.id,
          wifi: amenities.wifi,
          parking: amenities.parking,
          aircon: amenities.aircon
        });

      if (amenitiesError) throw amenitiesError;

      // Insert images
      for (const imageUrl of images) {
        const { error: mediaError } = await supabase
          .from('media')
          .insert({
            url: imageUrl,
            local_id: localData.id
          });

        if (mediaError) throw mediaError;
      }

      Alert.alert('Success', 'Service created successfully!');
      navigation.navigate('HomeScreen' as never);
    } catch (error) {
      console.error('Error creating local service:', error);
      Alert.alert('Error', 'Failed to create service. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.card}>
        <ProgressBar step={5} totalSteps={5} />
        <Text style={styles.title}>Créer un service local</Text>
        <Text style={styles.subtitle}>Étape 5: Confirmation</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Nom:</Text>
          <Text style={styles.infoText}>{serviceName}</Text>

          <Text style={styles.infoLabel}>Description:</Text>
          <Text style={styles.infoText}>{description}</Text>

          <Text style={styles.infoLabel}>Prix:</Text>
          <Text style={styles.infoText}>{price}€/heure</Text>

          <Text style={styles.infoLabel}>Intervalle:</Text>
          <Text style={styles.infoText}>{interval}</Text>

          <Text style={styles.infoLabel}>Date de début:</Text>
          <Text style={styles.infoText}>{moment(startDate).format('MMMM Do YYYY')}</Text>

          <Text style={styles.infoLabel}>Date de fin:</Text>
          <Text style={styles.infoText}>{moment(endDate).format('MMMM Do YYYY')}</Text>

          <Text style={styles.infoLabel}>Dates d'exception:</Text>
          {exceptionDates.length > 0 ? (
            exceptionDates.map((date, index) => (
              <Text key={index} style={styles.infoText}>
                -{moment(date).format('MMMM Do YYYY')}
              </Text>
            ))
          ) : (
            <Text style={styles.infoText}>Aucune</Text>
          )}
        </View>

        <View style={styles.amenitiesContainer}>
          <Text style={styles.infoLabel}>Équipements:</Text>
          <View style={styles.amenitiesGrid}>
            <View style={styles.amenityItem}>
              <Icon name="wifi" size={24} color={amenities.wifi ? '#FF3B30' : '#666'} />
              <Text style={styles.amenityText}>WiFi</Text>
            </View>
            <View style={styles.amenityItem}>
              <Icon name="local-parking" size={24} color={amenities.parking ? '#FF3B30' : '#666'} />
              <Text style={styles.amenityText}>Parking</Text>
            </View>
            <View style={styles.amenityItem}>
              <Icon name="ac-unit" size={24} color={amenities.aircon ? '#FF3B30' : '#666'} />
              <Text style={styles.amenityText}>Climatisation</Text>
            </View>
          </View>
        </View>

        {location && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Localisation:</Text>
            <Text style={styles.infoText}>
              Latitude: {location.latitude.toFixed(6)}
            </Text>
            <Text style={styles.infoText}>
              Longitude: {location.longitude.toFixed(6)}
            </Text>
          </View>
        )}

        <Text style={styles.imagesTitle}>Images</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
          {images.map((imageUri, index) => (
            <Image key={index} source={{ uri: imageUri }} style={styles.image} />
          ))}
        </ScrollView>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleConfirm}
        >
          <Text style={styles.buttonText}>Confirmer et Soumettre</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 20,
    margin: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  amenitiesContainer: {
    marginBottom: 20,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amenityText: {
    marginLeft: 10,
  },
  imagesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default CreateLocalServiceStep5;
