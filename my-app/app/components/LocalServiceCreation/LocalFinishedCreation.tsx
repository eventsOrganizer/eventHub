import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LocalFinishedCreationProps {
  formData: {
    subcategory: string;
    title: string;
    details: string;
    price: string;
    image: string | null;
    availableDates: { [date: string]: boolean };
    requiresAvailability: boolean;
    location: { latitude: number; longitude: number } | null;
    startDate: string; // Add startDate to formData
    exceptionDates: string[]; // Add exceptionDates to formData
  };
  onConfirm: () => void; // Function to handle confirmation
}

const LocalFinishedCreation: React.FC<LocalFinishedCreationProps> = ({ formData, onConfirm }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review Your Local Service</Text>

      <Text style={styles.label}>Subcategory:</Text>
      <Text style={styles.info}>{formData.subcategory}</Text>

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
        <Text style={styles.info}>No exception dates selected</Text>
      )}

      {/* Display the uploaded image if it exists */}
      {formData.image && (
        <Image source={{ uri: formData.image }} style={styles.image} />
      )}

      <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
        <Ionicons name="checkmark-circle" size={24} color="#fff" />
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
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
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default LocalFinishedCreation;
