import React from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';
import { format, parseISO } from 'date-fns';

type CreatePersonalServiceStep5ScreenRouteProp = RouteProp<RootStackParamList, 'CreatePersonalServiceStep5'>;
type CreatePersonalServiceStep5ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreatePersonalServiceStep5'>;

const CreatePersonalServiceStep5 = () => {
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

  const getDayOfWeek = (date: Date): string => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  };

  const handleConfirm = async () => {
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to create a service.');
      return;
    }

    try {
      console.log('Inserting personal service with data:', {
        name: serviceName,
        details: description,
        priceperhour: pricePerHour,
        percentage: depositPercentage,
        subcategory_id: subcategoryId,
        user_id: userId,
        startdate: startDate,
        enddate: endDate
      });

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

      console.log('Personal service created:', personalData);

      // Only create availability entries for exception dates
      const availabilityData = exceptionDates.map(dateString => {
        const date = parseISO(dateString);
        return {
          personal_id: personalData.id,
          date: dateString,
          startdate: startDate,
          enddate: endDate,
          daysofweek: getDayOfWeek(date),
          statusday: 'exception'
        };
      });

      console.log('Exception availability data to be inserted:', availabilityData);

      if (availabilityData.length > 0) {
        const { data: availabilityResult, error: availabilityError } = await supabase
          .from('availability')
          .insert(availabilityData)
          .select();

        if (availabilityError) {
          console.error('Error inserting availability:', availabilityError);
          throw availabilityError;
        }

        console.log('Exception availability insertion results:', availabilityResult);

        if (!availabilityResult || availabilityResult.length === 0) {
          console.warn('Exception availability inserted, but no data returned');
        } else {
          console.log(`Successfully inserted ${availabilityResult.length} exception availability records`);
        }
      } else {
        console.log('No exception dates to insert');
      }

      // Create an album for the service
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

      // Insert images into the media table
      const mediaPromises = images.map(imageUrl => 
        supabase
          .from('media')
          .insert({
            personal_id: personalData.id,
            url: imageUrl,
            album_id: albumData.id,
            // user_id: userId,
          })
      );

      await Promise.all(mediaPromises);

      Alert.alert('Success', 'Service and images submitted successfully!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error submitting service:', error);
      Alert.alert('Error', 'Error submitting service. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Service Name: {serviceName}</Text>
      <Text style={styles.label}>Description: {description}</Text>
      <Text style={styles.label}>Price per hour: ${pricePerHour}</Text>
      <Text style={styles.label}>Deposit Percentage: {depositPercentage}%</Text>
      <Text style={styles.label}>Interval: {interval}</Text>
      <Text style={styles.label}>Start Date: {startDate}</Text>
      <Text style={styles.label}>End Date: {endDate}</Text>
      <Text style={styles.label}>Exception Dates: {exceptionDates.join(', ')}</Text>
      <Text style={styles.label}>Images:</Text>
      {images.map((imageUri, index) => (
        <Image key={index} source={{ uri: imageUri }} style={styles.image} />
      ))}
      <Button title="Confirm and Submit" onPress={handleConfirm} />
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  image: { width: 100, height: 100, marginVertical: 10 },
});

export default CreatePersonalServiceStep5;