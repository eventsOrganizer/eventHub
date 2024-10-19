import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';

interface ImagePickerProps {
  images: string[];
  setImages: (images: string[]) => void;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ images, setImages }) => {
  const pickImage = async () => {
    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setImages([...images, ...result.assets.map(asset => asset.uri)]);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Select images</Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        {images.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.image} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
});

export default ImagePicker;