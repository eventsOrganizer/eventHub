import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import CloudinaryUpload from '../event/CloudinaryUpload';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import ProgressBar from '../reuseableForCreationService/ProgressBar';

type CreatePersonalServiceStep2RouteProp = RouteProp<RootStackParamList, 'CreatePersonalServiceStep2'>;
type CreatePersonalServiceStep2NavigationProp = StackNavigationProp<RootStackParamList, 'CreatePersonalServiceStep2'>;

const CreatePersonalServiceStep2: React.FC = () => {
  const navigation = useNavigation<CreatePersonalServiceStep2NavigationProp>();
  const route = useRoute<CreatePersonalServiceStep2RouteProp>();
  const { serviceName, description, subcategoryName, subcategoryId } = route.params;
  const [images, setImages] = useState<string[]>([]);

  const handleImagesUploaded = (urls: string[]) => {
    setImages(prevImages => [...prevImages, ...urls]);
  };

  const handleNext = () => {
    if (images.length === 0) {
      Alert.alert('Error', 'Please upload at least one image');
    } else {
      navigation.navigate('CreatePersonalServiceStep3', {
        serviceName,
        description,
        images,
        subcategoryName,
        subcategoryId,
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.card}>
        <ProgressBar step={2} totalSteps={4} />
        <Text style={styles.title}>Create New Crew</Text>
        <Text style={styles.subtitle}>Step 2: Add Images</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Service Name: {serviceName}</Text>
          <Text style={styles.infoText}>Description: {description}</Text>
          <Text style={styles.infoText}>Category: {subcategoryName}</Text>
        </View>
        <CloudinaryUpload onImagesUploaded={handleImagesUploaded} />
        <View style={styles.imagePreviewContainer}>
          <Text style={styles.imagePreviewText}>{images.length} image(s) uploaded</Text>
        </View>
        <TouchableOpacity 
          style={[styles.button, images.length === 0 && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={images.length === 0}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4c669f',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  imagePreviewContainer: {
    marginTop: 10,
  },
  imagePreviewText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CreatePersonalServiceStep2;
