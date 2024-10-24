import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';
import { format, parseISO } from 'date-fns';
import moment from 'moment';

interface LocalFinishedCreationProps {
  formData: {
    subcategory: string;
    title: string;
    details: string;
    price: string;
    image: string | null;
    images: string[]; // Ensure images is included in the formData type
    availableDates: { [date: string]: boolean };
    requiresAvailability: boolean;
    location: { latitude: number; longitude: number } | null;
    startDate: string;
    endDate: string; // Add this line
    exceptionDates: string[];
  };
  onConfirm: () => void;
}

const LocalFinishedCreation: React.FC<LocalFinishedCreationProps> = ({ formData, onConfirm }) => {
  const { userId } = useUser();

  const handleConfirm = async () => {
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to create a service.');
      return;
    }
  
    try {
      // Fetch the subcategory ID from the database
      const { data: subcategoryData, error: subcategoryError } = await supabase
        .from('subcategory')
        .select('id')
        .eq('name', formData.subcategory)
        .single();
  
      if (subcategoryError || !subcategoryData) {
        Alert.alert('Error', 'Subcategory not found.');
        return;
      }
  
      const subcategoryId = subcategoryData.id;
  
      // Create local service
      const { data: localData, error: localError } = await supabase
        .from('local')
        .insert({
          name: formData.title,
          details: formData.details,
          priceperhour: parseInt(formData.price), // Ensure price is an integer
          subcategory_id: subcategoryId, // Use fetched ID
          user_id: userId,
          startdate: formData.startDate,
          enddate: formData.endDate,
        })
        .select()
        .single();
  
      if (localError) throw localError;
      if (!localData) throw new Error('Failed to create local service');
  
      // Create album
      const { data: albumData, error: albumError } = await supabase
        .from('album')
        .insert({
          name: `${formData.title} Album`,
          details: `Album for ${formData.title}`,
          user_id: userId,
        })
        .select()
        .single();
  
      if (albumError) throw albumError;
  
      // Insert images into media table
      for (const imageUrl of formData.images) {
        const { error: mediaError } = await supabase
          .from('media')
          .insert({
            local_id: localData.id,
            url: imageUrl,
            album_id: albumData.id,
            type: 'image',
          });
  
        if (mediaError) throw mediaError;
      }
  
      // Insert availability data
      const availabilityData = Array.isArray(formData.availableDates) ? formData.availableDates.map((dateString: string) => ({
        local_id: localData.id,
        date: dateString,
      })) : [];
  
      if (availabilityData.length > 0) {
        const { error: availabilityError } = await supabase
          .from('availability')
          .insert(availabilityData);
  
        if (availabilityError) throw availabilityError;
      }
  
      Alert.alert('Success', 'Local service created successfully!');
      onConfirm(); // Call the onConfirm function to proceed
    } catch (error) {
      console.error('Error submitting local service:', error);
      Alert.alert('Error', 'An error occurred while creating the service. Please try again.');
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Review Your Local Service</Text>

      <Text style={styles.label}>Subcategory:</Text>
      <Text style={styles.info}>{(formData.subcategory) || 'Not specified'}</Text>

      <Text style={styles.label}>Title:</Text>
      <Text style={styles.info}>{formData.title}</Text>

      <Text style={styles.label}>Details:</Text>
      <Text style={styles.info}>{formData.details}</Text>

      <Text style={styles.label}>Price Per Hour:</Text>
      <Text style={styles.info}>${formData.price}</Text>

      <Text style={styles.label}>Location:</Text>
      {formData.location ? (
        <Text style={styles.info}>
          Latitude: {formData.location.latitude.toFixed(6)}, Longitude: {formData.location.longitude.toFixed(6)}
        </Text>
      ) : (
        <Text style={styles.info}>Not specified</Text>
      )}

      <Text style={styles.label}>Start Date:</Text>
      <Text style={styles.info}>{formData.startDate || 'Not specified'}</Text>

      <Text style={styles.label}>Exception Dates:</Text>
      {formData.exceptionDates.length > 0 ? (
        <Text style={styles.info}>{formData.exceptionDates.join(', ')}</Text>
      ) : (
        <Text style={styles.info}>No available dates selected</Text>
      )}

      {/* Display the uploaded images if they exist */}
      <Text style={styles.label}>Uploaded Images:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreviewContainer}>
        {formData.images.map((imageUri, index) => (
          <Image key={index} source={{ uri: imageUri }} style={styles.image} />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirm and Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff',
  },
  info: {
    fontSize: 16,
    marginBottom: 15,
    color: '#fff',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LocalFinishedCreation;
