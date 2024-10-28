import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

interface LocalDetailsStepProps {
  formData: any;
  setFormData: (data: any) => void;
  setIsButtonDisabled: (disabled: boolean) => void; // Added to control the button state
}

const LocalDetailsStep: React.FC<LocalDetailsStepProps> = ({ formData, setFormData, setIsButtonDisabled }) => {
  const [images, setImages] = useState<string[]>(formData.images || []);

  // Check if the form is valid for the next button to be enabled
  useEffect(() => {
    const isFormValid = formData.title && formData.details && images.length > 0;
    setIsButtonDisabled(!isFormValid); // Disable if the form is not valid
  }, [formData.title, formData.details, images, setIsButtonDisabled]);

  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImages = result.assets.map((asset) => asset.uri);
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      setFormData({ ...formData, images: updatedImages }); // Update formData with new images
    }
  };

  return (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.container}>
      <Text style={styles.label}>Local Service Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter service title"
        placeholderTextColor="#a0a0a0"
        value={formData.title}
        onChangeText={(text) => setFormData({ ...formData, title: text })}
      />
      <Text style={styles.label}>Local Service Details</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter service details"
        placeholderTextColor="#a0a0a0"
        value={formData.details}
        onChangeText={(text) => setFormData({ ...formData, details: text })}
        multiline
        numberOfLines={4}
      />
      <Text style={styles.label}>Upload Photos</Text>
      <TouchableOpacity onPress={handleImageUpload} style={styles.uploadButton}>
        <MaterialIcons name="cloud-upload" size={24} color="#fff" />
        <Text style={styles.uploadText}>Choose Photos</Text>
      </TouchableOpacity>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreviewContainer}>
        {images.map((imageUri, index) => (
          <Image key={index} source={{ uri: imageUri }} style={styles.image} />
        ))}
      </ScrollView>
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
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  input: {
    height: 50,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
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
});

export default LocalDetailsStep;
