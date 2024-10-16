import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import Slider from '@react-native-community/slider'; // Add slider import
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';

type RouteParams = {
  serviceName: string;
  description: string;
  images: string[];
  subcategoryName: string;
  subcategoryId: string;
};

type CreateLocalServiceStackParamList = {
  CreateLocalServiceStep4: {
    serviceName: string;
    description: string;
    images: string[];
    price: string;
    availabilityFrom: string;
    availabilityTo: string;
    subcategoryName: string;
    subcategoryId: string;
  };
};

const CreateLocalServiceStep3 = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const navigation = useNavigation<NavigationProp<CreateLocalServiceStackParamList, 'CreateLocalServiceStep4'>>();
  const { serviceName, description, images, subcategoryName, subcategoryId } = route.params;

  const [price, setPrice] = useState('30'); // Default starting price
  const [availabilityFrom, setAvailabilityFrom] = useState('');
  const [availabilityTo, setAvailabilityTo] = useState('');

  const handleNext = () => {
    if (images.length === 0) {
      Alert.alert('Please select at least one image');
    } else {
      navigation.navigate('CreateLocalServiceStep4', {
        serviceName,
        description,
        subcategoryName,
        subcategoryId,
        images,
        price,
        availabilityFrom,
        availabilityTo,
      });
    }
  };

  const handlePriceChange = (value: number) => {
    setPrice(value.toString());
  };

  return (
    <View style={styles.container}>
      <Text>Price</Text>
      <View style={styles.priceContainer}>
        <Slider
          style={styles.slider}
          minimumValue={30}
          maximumValue={2000}
          step={1} // Slider will increment in whole numbers
          value={Number(price)}
          onValueChange={handlePriceChange} // Update price as the slider moves
          minimumTrackTintColor="#1E90FF"
          maximumTrackTintColor="#000000"
        />
        <TextInput
          style={styles.priceInput}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          maxLength={4} // Limit input to 4 characters (e.g., 2000)
        />
      </View>

      <Text>Available From</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Availability From"
        value={availabilityFrom}
        onChangeText={setAvailabilityFrom}
      />

      <Text>Available Until</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Availability To"
        value={availabilityTo}
        onChangeText={setAvailabilityTo}
      />

      <Button title="Next" onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  priceInput: {
    width: 80, // Small input for manual price entry
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
    textAlign: 'center', // Center the text in the input
  },
});

export default CreateLocalServiceStep3;
