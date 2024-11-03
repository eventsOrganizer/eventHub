import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import ProgressBar from '../reuseableForCreationService/ProgressBar';
import MapScreen from '../../screens/MapScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';

type RouteParams = {
  serviceName: string;
  description: string;
  images: string[];
  price: number;
  subcategoryId: string;
  subcategoryName: string;
  startDate: string;
  endDate: string;
  interval: string;
  exceptionDates: string[];
};

const CreateLocalServiceStep4 = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { serviceName, description, images, price, startDate, endDate, interval, exceptionDates, subcategoryName, subcategoryId } = route.params;

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [amenities, setAmenities] = useState({ wifi: false, parking: false, aircon: false });

  const handleLocationSelected = (selectedLocation: { latitude: number; longitude: number }) => {
    setLocation(selectedLocation);
    setShowMap(false);
  };

  const toggleAmenity = (amenity: keyof typeof amenities) => {
    setAmenities(prev => ({ ...prev, [amenity]: !prev[amenity] }));
  };

  const handleNext = () => {
    if (!location) {
      Alert.alert("Erreur", "Veuillez sélectionner un emplacement avant de continuer.");
      return;
    }

    navigation.navigate('CreateLocalServiceStep5', {
      serviceName,
      description,
      images,
      price: price.toString(),
      location,
      amenities,
      startDate,
      endDate,
      interval,
      exceptionDates,
      subcategoryId,
      subcategoryName
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.card}>
        <ProgressBar step={4} totalSteps={5} />
        <Text style={styles.title}>Créer un service local</Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 20 }}>Étape 4: Localisation et Équipements</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowMap(true)}
        >
          <Text style={styles.buttonText}>
            {location ? 'Modifier la localisation' : 'Sélectionner la localisation'}
          </Text>
        </TouchableOpacity>
        {location && (
          <Text style={{ fontSize: 16, color: '#333', marginBottom: 20 }}>
            Localisation sélectionnée: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </Text>
        )}
        {showMap && (
          <View style={styles.container}>
            <MapScreen onLocationSelected={handleLocationSelected} />
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowMap(false)}
            >
              <Text style={styles.buttonText}>Fermer la carte</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 20 }}>Équipements disponibles</Text>
          {Object.entries(amenities).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={{ backgroundColor: value ? '#007bff' : '#fff', padding: 10, borderRadius: 20, marginVertical: 5, width: '100%', alignItems: 'center', justifyContent: 'center' }}
              onPress={() => toggleAmenity(key as keyof typeof amenities)}
            >
              <Icon name={getAmenityIcon(key)} size={24} color={value ? '#fff' : '#666'} />
              <Text style={{ fontSize: 16, color: value ? '#fff' : '#333' }}>
                {getAmenityLabel(key)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, !location && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!location}
        >
          <Text style={styles.buttonText}>Suivant</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const getAmenityIcon = (amenity: string): string => {
  switch (amenity) {
    case 'wifi': return 'wifi';
    case 'parking': return 'local-parking';
    case 'aircon': return 'ac-unit';
    default: return 'help';
  }
};

const getAmenityLabel = (amenity: string): string => {
  switch (amenity) {
    case 'wifi': return 'Wi-Fi';
    case 'parking': return 'Parking';
    case 'aircon': return 'Climatisation';
    default: return amenity;
  }
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  spacing: {
    height: 60, // Spacing after the back button
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 20,
  },
  cardContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20,
  },
  card: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff', // White border for consistency
    backgroundColor: '#333', // Dark background for the cards
    elevation: 2,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#FF3B30', 
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#FF3B30', 
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.8, 
    shadowRadius: 10,
  },
  buttonText: {
    color: '#fff', 
    fontSize: 18,
    fontWeight: 'bold',
  },
  mapButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    marginBottom: 20,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default CreateLocalServiceStep4;
