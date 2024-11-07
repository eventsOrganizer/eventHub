import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

interface CloudinaryUploadProps {
  onImagesUploaded: (urls: string[]) => void;
  buttonStyle?: object;
  buttonTextStyle?: object;
}

const CloudinaryUploadPrivate: React.FC<CloudinaryUploadProps> = ({ onImagesUploaded, buttonStyle, buttonTextStyle }) => {
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const pickImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      setUploadStatus('error');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages(prevImages => [...prevImages, ...newImages]);
    }
  };

  const uploadImages = async () => {
    if (images.length === 0) {
      setUploadStatus('error');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');
    const uploadedUrls: string[] = [];

    for (const uri of images) {
      const formData = new FormData();
      formData.append('file', { uri, type: 'image/jpeg', name: 'upload.jpg' } as any);
      formData.append('upload_preset', 'ml_default');
      formData.append('cloud_name', 'dr07atq6z');

      try {
        const response = await fetch('https://api.cloudinary.com/v1_1/dr07atq6z/image/upload', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        });

        const data = await response.json();
        if (response.ok && data.secure_url) {
          uploadedUrls.push(data.secure_url);
        } else {
          console.error('Upload failed:', data.error?.message || 'Unknown error');
          setUploadStatus('error');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        setUploadStatus('error');
      }
    }

    setIsUploading(false);
    if (uploadedUrls.length > 0) {
      onImagesUploaded(uploadedUrls);
      setImages([]);
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 2000);
    } else {
      setUploadStatus('error');
    }
  };
  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'success':
        return <Ionicons name="checkmark-circle" size={24} color="white" style={styles.statusIcon} />;
      case 'error':
        return <Ionicons name="close-circle" size={24} color="white" style={styles.statusIcon} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, buttonStyle]} onPress={pickImages}>
        <Text style={[styles.buttonText, buttonTextStyle]}>Pick Images</Text>
      </TouchableOpacity>
      <FlatList
        data={images}
        renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} />}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
      />
      {images.length > 0 && (
        <View style={styles.uploadContainer}>
          <TouchableOpacity 
            style={[styles.button, buttonStyle, isUploading && styles.buttonDisabled]} 
            onPress={uploadImages}
            disabled={isUploading}
          >
            <Text style={[styles.buttonText, buttonTextStyle]}>
              {isUploading ? 'Téléchargement en cours...' : 'Télécharger les images'}
            </Text>
          </TouchableOpacity>
          {getStatusIcon()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
  uploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginLeft: 10,
  },
  spinningIcon: {
    transform: [{ rotate: '360deg' }],
  },
  uploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginLeft: 10,
  },
});

export default CloudinaryUploadPrivate;