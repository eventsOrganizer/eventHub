import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text, FlatList, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface CloudinaryUploadProps {
  onImagesUploaded: (urls: string[]) => void;
  buttonStyle?: object;
  buttonTextStyle?: object;
}

const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({ onImagesUploaded, buttonStyle, buttonTextStyle }) => {
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const pickImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à vos photos.');
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
      Alert.alert('Erreur', 'Veuillez sélectionner au moins une image');
      return;
    }

    setIsUploading(true);
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
          console.error('Échec du téléchargement :', data.error?.message || 'Erreur inconnue');
        }
      } catch (error) {
        console.error('Erreur lors du téléchargement de l\'image:', error);
      }
    }

    setIsUploading(false);
    if (uploadedUrls.length > 0) {
      onImagesUploaded(uploadedUrls);
      setImages([]);
      Alert.alert('Succès', `${uploadedUrls.length} image(s) téléchargée(s) avec succès`);
    } else {
      Alert.alert('Erreur', 'Aucune image n\'a pu être téléchargée');
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
        <TouchableOpacity 
          style={[styles.button, buttonStyle, isUploading && styles.buttonDisabled]} 
          onPress={uploadImages}
          disabled={isUploading}
        >
          <Text style={[styles.buttonText, buttonTextStyle]}>
            {isUploading ? 'Téléchargement en cours...' : 'Télécharger les images'}
          </Text>
        </TouchableOpacity>
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
});

export default CloudinaryUpload;