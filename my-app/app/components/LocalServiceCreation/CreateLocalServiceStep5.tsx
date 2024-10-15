import React from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { supabase } from '../../services/supabaseClient'; // Ensure correct import path
import { useUser } from '../../UserContext'; // Importing useUser

type RouteParams = {
  serviceName: string;
  description: string;
  images: string[];
  price: string;
  availabilityFrom: string;
  availabilityTo: string;
  amenities: {
    wifi: boolean;
    parking: boolean;
    aircon: boolean;
  };
  subcategoryName: string;
  subcategoryId: string; // Add subcategoryId here
};

type NavigationProps = StackNavigationProp<RootStackParamList, 'CreateLocalServiceStep5'>;

const CreateLocalServiceStep5 = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const { serviceName, description, images, price, availabilityFrom, availabilityTo, amenities, subcategoryName, subcategoryId } = route.params; // Extract subcategoryId

  // Accessing userId from the context
  const { userId } = useUser();

  const handleConfirm = async () => {
    // Check if userId and subcategoryId are available
    if (!userId) {
      Alert.alert('You must be logged in to create a service.');
      return;
    }

    if (!subcategoryId) {
      Alert.alert('Subcategory ID is required.');
      return;
    }

    // Log the parameters to debug
    console.log('Inserting with the following parameters:');
    console.log({
      serviceName,
      description,
      price,
      subcategoryId, // Ensure subcategoryId is logged
      userId,
    });

    // Proceed with service submission
    try {
      const { data, error } = await supabase
        .from('local')
        .insert({
          name: serviceName,
          details: description,
          priceperhour: parseFloat(price),
          subcategory_id: parseInt(subcategoryId), // Ensure this is a valid integer
          user_id: userId,
        });

      if (error) throw error;

      Alert.alert('Service submitted successfully!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error submitting service:', error);
      Alert.alert('Error submitting service. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Service Name: {serviceName}</Text>
      <Text style={styles.label}>Description: {description}</Text>
      <Text style={styles.label}>Subcategory: {subcategoryName}</Text>
      <Text style={styles.label}>Price: {price}</Text>
      <Text style={styles.label}>Available From: {availabilityFrom}</Text>
      <Text style={styles.label}>Available To: {availabilityTo}</Text>
      <Text style={styles.label}>Amenities:</Text>
      <Text>WiFi: {amenities.wifi ? 'Yes' : 'No'}</Text>
      <Text>Parking: {amenities.parking ? 'Yes' : 'No'}</Text>
      <Text>Air Conditioning: {amenities.aircon ? 'Yes' : 'No'}</Text>
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

export default CreateLocalServiceStep5;
