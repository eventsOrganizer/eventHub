import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as Animatable from 'react-native-animatable';

type RouteParams = {
  serviceName: string;
  description: string;
  subcategoryName: string; // Use subcategoryName instead of subcategoryId
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
        ...result.assets.map((asset) => asset.uri)
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
        subcategories
      });
    }
  };

  return (
    <Animatable.View animation="fadeInUp" style={styles.container}>
      <Animatable.Text animation="fadeInLeft" style={styles.label}>Service Name: {serviceName}</Animatable.Text>
      <Animatable.Text animation="fadeInLeft" style={styles.label}>Description: {description}</Animatable.Text>
      <Animatable.Text animation="fadeInLeft" style={styles.label}>Category: {subcategoryName}</Animatable.Text>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick Images</Text>
      </TouchableOpacity>
      
      {images.length > 0 && (
        <Text style={styles.imagesText}>{images.length} image(s) selected</Text>
      )}
      
      <Animatable.View animation="pulse" delay={400} style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </Animatable.View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#000',
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
  imagesText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default CreateLocalServiceStep2;
