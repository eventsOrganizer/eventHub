import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assuming you're using MaterialIcons
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import * as Animatable from 'react-native-animatable';

type RouteParams = {
  serviceName: string;
  description: string;
  images: string[];
  price: string;
  availabilityFrom: string;
  availabilityTo: string;
  subcategoryName: string;
  subcategoryId: string;
};

const CreateLocalServiceStep4 = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'CreateLocalServiceStep4'>>();

  const { serviceName, description, images, price, availabilityFrom, availabilityTo, subcategoryName, subcategoryId } = route.params;

  const [amenities, setAmenities] = useState({ wifi: false, parking: false, aircon: false });

  const handleNext = () => {
    navigation.navigate('CreateLocalServiceStep5', {
      serviceName,
      description,
      images,
      price,
      availabilityFrom,
      availabilityTo,
      amenities,
      subcategoryName,
      subcategoryId,
    });
  };

  const toggleAmenity = (amenity: 'wifi' | 'parking' | 'aircon') => {
    setAmenities({ ...amenities, [amenity]: !amenities[amenity] });
  };

  const getBorderStyle = (isActive: boolean) => {
    return isActive ? { borderColor: 'red', borderWidth: 2 } : {};
  };

  return (
    <Animatable.View animation="fadeInUp" style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Spacing between the arrow and content */}
      <View style={styles.spacing} />

      <Animatable.Text animation="fadeInLeft" style={styles.title}>Select Amenities</Animatable.Text>

      <View style={styles.cardContainer}>
        {/* WiFi Card */}
        <TouchableOpacity
          style={[styles.card, getBorderStyle(amenities.wifi)]}
          onPress={() => toggleAmenity('wifi')}
        >
          <Icon name="wifi" size={40} color={amenities.wifi ? 'red' : 'black'} />
        </TouchableOpacity>

        {/* Parking Card */}
        <TouchableOpacity
          style={[styles.card, getBorderStyle(amenities.parking)]}
          onPress={() => toggleAmenity('parking')}
        >
          <Icon name="local-parking" size={40} color={amenities.parking ? 'red' : 'black'} />
        </TouchableOpacity>

        {/* Air Conditioning Card */}
        <TouchableOpacity
          style={[styles.card, getBorderStyle(amenities.aircon)]}
          onPress={() => toggleAmenity('aircon')}
        >
          <Icon name="ac-unit" size={40} color={amenities.aircon ? 'red' : 'black'} />
        </TouchableOpacity>
      </View>

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
});

export default CreateLocalServiceStep4;
