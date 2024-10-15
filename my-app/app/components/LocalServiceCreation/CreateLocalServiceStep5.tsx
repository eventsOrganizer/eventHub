import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { supabase } from '../../services/supabaseClient'; // Ensure correct import path

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
  subcategoryId: string; // Ensure this is a string
  subcategories?: {
    id: string; // Ensure this matches the type of subcategoryId
    name: string;
  }[];
};

type NavigationProps = StackNavigationProp<RootStackParamList, 'CreateLocalServiceStep5'>;

const CreateLocalServiceStep5 = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const { serviceName, description, images, price, availabilityFrom, availabilityTo, amenities, subcategoryId } = route.params;

  const handleConfirm = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
  
    // Check if user is null or error exists
    if (error || !user) {
      Alert.alert('You must be logged in to create a service.');
      return;
    }
  
    // Proceed with service submission
    try {
      const { data, error } = await supabase
        .from('local')
        .insert({
          name: serviceName,
          details: description,
          priceperhour: parseFloat(price),
          subcategory_id: parseInt(subcategoryId),
          user_id: user.id, // Safely access user id
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
      <Text style={styles.label}>Subcategory: {subcategoryId}</Text>
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
