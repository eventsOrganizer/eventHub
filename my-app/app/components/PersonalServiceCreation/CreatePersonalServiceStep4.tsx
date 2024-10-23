import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import MapScreen from '../../screens/MapScreen';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import ProgressBar from '../reuseableForCreationService/ProgressBar';

type CreatePersonalServiceStep4ScreenRouteProp = RouteProp<RootStackParamList, 'CreatePersonalServiceStep4'>;
type CreatePersonalServiceStep4ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreatePersonalServiceStep4'>;

const CreatePersonalServiceStep4: React.FC = () => {
  const navigation = useNavigation<CreatePersonalServiceStep4ScreenNavigationProp>();
  const route = useRoute<CreatePersonalServiceStep4ScreenRouteProp>();
  const { serviceName, description, images, pricePerHour, depositPercentage, subcategoryId, interval, startDate, endDate, exceptionDates, subcategoryName } = route.params;

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showMap, setShowMap] = useState(false);

  const handleLocationSelected = (selectedLocation: { latitude: number; longitude: number }) => {
    setLocation(selectedLocation);
    setShowMap(false);
  };

  const handleNext = () => {
    if (location) {
      navigation.navigate('CreatePersonalServiceStep5', {
        serviceName,
        description,
        images,
        pricePerHour,
        depositPercentage,
        subcategoryId,
        subcategoryName,
        interval,
        startDate,
        endDate,
        exceptionDates,
        location: location
      });
    } else {
      Alert.alert("Erreur", "Veuillez sélectionner un emplacement avant de continuer.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.card}>
        <ProgressBar step={4} totalSteps={5} />
        <Text style={styles.title}>Create New Crew</Text>
        <Text style={styles.subtitle}>Step 4: Select Location</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowMap(true)}
        >
          <Text style={styles.buttonText}>
            {location ? 'Change Location' : 'Select Location'}
          </Text>
        </TouchableOpacity>

        {location && (
          <Text style={styles.locationText}>
            Selected Location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </Text>
        )}

        {showMap && (
          <View style={styles.mapContainer}>
            <MapScreen onLocationSelected={handleLocationSelected} />
            <TouchableOpacity
              style={styles.closeMapButton}
              onPress={() => setShowMap(false)}
            >
              <Text style={styles.buttonText}>Close Map</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
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
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  locationText: {
    color: 'white',
    fontSize: 16,
    marginVertical: 10,
  },
  mapContainer: {
    height: 300,
    marginVertical: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  closeMapButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default CreatePersonalServiceStep4;
