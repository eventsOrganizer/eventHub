import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';
import { format, parseISO } from 'date-fns';

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
    exceptionDates = []
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

      Alert.alert('Succès', 'Service créé avec succès !');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Erreur lors de la soumission du service:', error);
      Alert.alert('Erreur', 'Erreur lors de la création du service. Veuillez réessayer.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create a Personal Service</Text>
        <Text style={styles.subtitle}>Étape 5 : Confirmation</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Name : {serviceName}</Text>
          <Text style={styles.infoText}>Description : {description}</Text>
          <Text style={styles.infoText}>Price perhour: {pricePerHour}€</Text>
          <Text style={styles.infoText}>Percentage of deposit : {depositPercentage}%</Text>
          <Text style={styles.infoText}>Interval : {interval}</Text>
          <Text style={styles.infoText}>Start date : {startDate}</Text>
          <Text style={styles.infoText}>End date : {endDate}</Text>
          <Text style={styles.infoText}>Exception date : {exceptionDates.join(', ')}</Text>
        </View>
        <Text style={styles.imagesTitle}>Images :</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
          {images.map((imageUri, index) => (
            <Image key={index} source={{ uri: imageUri }} style={styles.image} />
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirm and Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  card: {
    backgroundColor: 'white',
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
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
  imagesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    backgroundColor: '#4a90e2',
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