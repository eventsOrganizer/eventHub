import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';

interface MediaFile {
  uri: string;
  type: 'image' | 'video';
}

interface ConfirmationStepProps {
  formData: {
    subcategory: string;
    rentOrSale: string;
    title: string;
    details: string;
    price: string;
    quantity: string;
    mediaFiles: MediaFile[];
    availableDates: Record<string, boolean>;
  };
  onConfirm: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ formData, onConfirm }) => {
  return (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.container}>
      <Text style={styles.title}>Confirm Your Material Details</Text>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.label}>Subcategory ID:</Text>
          <Text style={styles.value}>{formData.subcategory}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Type:</Text>
          <Text style={styles.value}>{formData.rentOrSale === 'rent' ? 'For Rent' : 'For Sale'}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Title:</Text>
          <Text style={styles.value}>{formData.title}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Details:</Text>
          <Text style={styles.value}>{formData.details}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Price:</Text>
          <Text style={styles.value}>
            ${formData.price}{formData.rentOrSale === 'rent' ? '/hour' : ''}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Quantity:</Text>
          <Text style={styles.value}>{formData.quantity}</Text>
        </View>
        {formData.rentOrSale === 'rent' && (
          <View style={styles.section}>
            <Text style={styles.label}>Available Dates:</Text>
            <Text style={styles.value}>
              {Object.keys(formData.availableDates).filter(date => formData.availableDates[date]).join(', ')}
            </Text>
          </View>
        )}
        
        {formData.mediaFiles && formData.mediaFiles.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Media Files:</Text>
            <ScrollView horizontal style={styles.mediaContainer}>
              {formData.mediaFiles.map((file, index) => (
                <View key={index} style={styles.mediaPreview}>
                  <Image source={{ uri: file.uri }} style={styles.previewImage} />
                  {file.type === 'video' && (
                    <View style={styles.videoIndicator}>
                      <MaterialIcons name="videocam" size={20} color="#fff" />
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
      
      <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
        <MaterialIcons name="check-circle" size={24} color="#fff" />
        <Text style={styles.confirmButtonText}>Confirm and Submit</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  scrollView: {
    maxHeight: 400,
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#fff',
  },
  mediaContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  mediaPreview: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  videoIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
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
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ConfirmationStep;