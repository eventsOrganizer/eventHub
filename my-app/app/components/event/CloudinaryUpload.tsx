import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface CloudinaryUploadProps {
  onImageUploaded: (url: string) => void;
}

const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({ onImageUploaded }) => {
  const [image, setImage] = useState<string | null>(null);

  // Function to pick an image
  const pickImage = async () => {
    // Ask for permission to access photos
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to allow permission to access your photos.');
      return;
    }

    // Pick the image
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Check if the image selection is canceled or not
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const pickedUri = result.assets[0].uri;
      setImage(pickedUri); // Set the local image preview
      uploadImage(pickedUri); // Upload the image
    } else {
      Alert.alert('Cancelled', 'No image selected.');
    }
  };

  // Function to upload the image to Cloudinary
  const uploadImage = async (uri: string) => {
    const formData = new FormData();
    formData.append('file', { uri, type: 'image/jpeg', name: 'upload.jpg' } as any); // Adjust file handling
    formData.append('upload_preset', 'ml_default'); // Replace this with your actual upload preset
    formData.append('cloud_name', 'dr07atq6z'); // Cloud name from your Cloudinary account

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dr07atq6z/image/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data', // Ensuring correct content-type for image uploads
        },
      });

      const data = await response.json();
      if (response.ok && data.secure_url) {
        onImageUploaded(data.secure_url); // Pass the URL to the parent component
        Alert.alert('Success', 'Image uploaded successfully');
      } else {
        Alert.alert('Error', `Upload failed: ${data.error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'An error occurred during the upload');
    }
  };

  return (
    <View style={styles.container}>
      <Button title={image ? 'Change image' : 'Pick an image from camera roll'} onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});

export default CloudinaryUpload;
