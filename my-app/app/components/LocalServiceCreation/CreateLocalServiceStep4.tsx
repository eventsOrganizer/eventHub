import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Switch } from 'react-native-paper'; 
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
  subcategoryName: string; // Use subcategoryName
};

// Define the type for the navigation parameters
type CreateLocalServiceStep5Params = {
  serviceName: string;
  description: string;
  images: string[];
  price: string;
  availabilityFrom: string;
  availabilityTo: string;
  amenities: {
    wifi: boolean;
    parking: boolean;
    aircon: boolean;
  };
};

const CreateLocalServiceStep4 = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'CreateLocalServiceStep4'>>();

  const { serviceName, description, images, price, availabilityFrom, availabilityTo, subcategoryName } = route.params;

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
      subcategoryName, // Pass subcategoryName
    });
  };

  return (
    <View style={styles.container}>
      <Text>Select Amenities</Text>
      <View style={styles.switchContainer}>
        <Text>WiFi</Text>
        <Switch
          value={amenities.wifi}
          onValueChange={(value) => setAmenities({ ...amenities, wifi: value })}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text>Parking</Text>
        <Switch
          value={amenities.parking}
          onValueChange={(value) => setAmenities({ ...amenities, parking: value })}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text>Air Conditioning</Text>
        <Switch
          value={amenities.aircon}
          onValueChange={(value) => setAmenities({ ...amenities, aircon: value })}
        />
      </View>
      <Button title="Next" onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
});

export default CreateLocalServiceStep4;
