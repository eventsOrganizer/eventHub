import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assuming you're using MaterialIcons
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';

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
    <View style={styles.container}>
      <Text style={styles.title}>Select Amenities</Text>

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

      <Button title="Next" onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  cardContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  card: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    elevation: 2,
  },
});

export default CreateLocalServiceStep4;
