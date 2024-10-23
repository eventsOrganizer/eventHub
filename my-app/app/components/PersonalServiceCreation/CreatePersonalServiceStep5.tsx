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

// Ajoutez cette interface en haut du fichier
interface Location {
  latitude: number;
  longitude: number;
}

type CreatePersonalServiceStep5ScreenRouteProp = RouteProp<RootStackParamList, 'CreatePersonalServiceStep5'>;
type CreatePersonalServiceStep5ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreatePersonalServiceStep5'>;

const CreatePersonalServiceStep5: React.FC = () => {
  const navigation = useNavigation<CreatePersonalServiceStep5ScreenNavigationProp>();
  const route = useRoute<CreatePersonalServiceStep5ScreenRouteProp>();
  const { 
    serviceName, 
    description, 
    images, 
    pricePerHour, 
    depositPercentage, 
    subcategoryId, 
    interval, 
    startDate, 
    endDate, 
    exceptionDates = [],
    location, // Assurez-vous que cette ligne existe
  } = route.params;
  const { userId } = useUser();

  const handleConfirm = async () => {
    if (!userId) {
      Alert.alert('Erreur', 'Vous devez être connecté pour créer un service.');
      return;
    }

    try {
      const { data: personalData, error: personalError } = await supabase
        .from('personal')
        .insert({
          name: serviceName,
          details: description,
          priceperhour: pricePerHour,
          percentage: depositPercentage,
          subcategory_id: subcategoryId,
          user_id: userId,
          startdate: startDate,
          enddate: endDate
        })
        .select()
        .single();

      if (personalError) throw personalError;

      if (!personalData) {
        throw new Error('Failed to create personal service');
      }

      const { data: albumData, error: albumError } = await supabase
        .from('album')
        .insert({
          name: `${serviceName} Album`,
          details: `Album for ${serviceName}`,
          user_id: userId,
        })
        .select()
        .single();

      if (albumError) throw albumError;

      const mediaPromises = images.map(imageUrl => 
        supabase
          .from('media')
          .insert({
            personal_id: personalData.id,
            url: imageUrl,
            album_id: albumData.id,
          })
      );

      await Promise.all(mediaPromises);

      const availabilityData = exceptionDates.map(dateString => ({
        personal_id: personalData.id,
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

      // Ajouter la localisation à la base de données
      if (location) {
        const { data: locationData, error: locationError } = await supabase
          .from('location')
          .insert({
            longitude: location.longitude,
            latitude: location.latitude,
            personal_id: personalData.id,
          });

        if (locationError) {
          console.error('Error inserting location:', locationError);
          // Gérer l'erreur
        }
      }

      Alert.alert('Succès', 'Service créé avec succès !');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Erreur lors de la soumission du service:', error);
      Alert.alert('Erreur', 'Erreur lors de la création du service. Veuillez réessayer.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.card}>
        <ProgressBar step={5} totalSteps={5} />
        <Text style={styles.title}>Create New Crew</Text>
        <Text style={styles.subtitle}>Step 5: Confirmation</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoText}>{serviceName}</Text>
          
          <Text style={styles.infoLabel}>Description:</Text>
          <Text style={styles.infoText}>{description}</Text>
          
          <Text style={styles.infoLabel}>Price per hour:</Text>
          <Text style={styles.infoText}>{pricePerHour}€</Text>
          
          <Text style={styles.infoLabel}>Deposit percentage:</Text>
          <Text style={styles.infoText}>{depositPercentage}%</Text>
          
          <Text style={styles.infoLabel}>Interval:</Text>
          <Text style={styles.infoText}>{interval}</Text>
          
          <Text style={styles.infoLabel}>Start date:</Text>
          <Text style={styles.infoText}>{moment(startDate).format('MMMM Do YYYY')}</Text>
          
          <Text style={styles.infoLabel}>End date:</Text>
          <Text style={styles.infoText}>{moment(endDate).format('MMMM Do YYYY')}</Text>
          
          <Text style={styles.infoLabel}>Exception dates:</Text>
          {/* <Text style={styles.infoText}>{exceptionDates.map(date => moment(date).format('MMMM Do YYYY')).join(', ') || 'None'}</Text> */}
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
        
        {location && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Localisation :</Text>
            <Text style={styles.infoText}>
              Latitude : {location.latitude.toFixed(6)}
            </Text>
            <Text style={styles.infoText}>
              Longitude : {location.longitude.toFixed(6)}
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
          <Text style={styles.buttonText}>Confirm and Submit</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4c669f',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
  },
  imagesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CreatePersonalServiceStep5;
