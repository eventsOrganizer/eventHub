import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Icon from react-native-vector-icons

type RouteParams = {
  serviceName: string;
  description: string;
  subcategoryName: string;
  subcategories?: { id: number; name: string }[];
};

type RootStackParamList = {
  CreateLocalServiceStep3: {
    serviceName: string;
    description: string;
    images: string[];
    subcategoryId: number;
    subcategories?: { id: number; name: string }[];
  };
};

type CreateLocalServiceStep2NavigationProp = NavigationProp<
  RootStackParamList,
  'CreateLocalServiceStep3'
>;

type CreateLocalServiceStep2RouteProp = RouteProp<
  RootStackParamList,
  'CreateLocalServiceStep3'
>;

type Props = {
  navigation: CreateLocalServiceStep2NavigationProp;
  route: CreateLocalServiceStep2RouteProp;
};

const CreateLocalServiceStep2: React.FC<Props> = ({ navigation, route }) => {
  const { serviceName, description, subcategoryName, subcategoryId, subcategories = [] } = route.params;
  const [images, setImages] = useState<string[]>([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setImages((prevImages) => [
        ...prevImages,
        ...result.assets.map((asset) => asset.uri),
      ]);
    }
  };

  const handleNext = () => {
    if (images.length === 0) {
      Alert.alert('Please select at least one image');
    } else {
      navigation.navigate('CreateLocalServiceStep3', {
        serviceName,
        description,
        images,
        subcategoryName,
        subcategoryId,
        subcategories,
      });
    }
  };

  const handleImagePress = (uri: string) => {
    setImages((prevImages) => prevImages.filter((image) => image !== uri));
  };

  return (
    <Animatable.View animation="fadeInUp" style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Spacing between the arrow and content */}
      <View style={styles.spacing} />

      <Animatable.Text animation="fadeInLeft" style={styles.label}>Service Name: {serviceName}</Animatable.Text>
      <Animatable.Text animation="fadeInLeft" style={styles.label}>Description: {description}</Animatable.Text>
      <Animatable.Text animation="fadeInLeft" style={styles.label}>Category: {subcategoryName}</Animatable.Text>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick Images</Text>
      </TouchableOpacity>

      {images.length > 0 && (
        <FlatList
          data={images}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleImagePress(item)}>
              <Image source={{ uri: item }} style={styles.imageThumbnail} />
            </TouchableOpacity>
          )}
          numColumns={3} // Set the number of columns to 3
          showsHorizontalScrollIndicator={false}
          style={styles.imagesContainer}
        />
      )}

      {/* Sticky button at the bottom */}
      <TouchableOpacity style={styles.stickyButton} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
    position: 'relative', // Make the container relative to position children absolutely
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20, // Position to the top left
    zIndex: 1,
    marginBottom: 10, // Add margin bottom for spacing
  },
  spacing: {
    height: 60, // Adjust this value for the desired spacing
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10, // Space between buttons
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imagesContainer: {
    marginTop: 10,
    marginBottom: 20, // Space before the next button
  },
  imageThumbnail: {
    width: '100%', // Set the width to 100% of the column
    height: 100, // Set a consistent height
    aspectRatio: 1, // Maintain a square aspect ratio
    borderRadius: 10,
    margin: 5, // Set margin to create space between images
  },
  stickyButton: {
    position: 'absolute',
    bottom: 20, // Position the button at the bottom
    left: 20,
    right: 20,
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default CreateLocalServiceStep2;
