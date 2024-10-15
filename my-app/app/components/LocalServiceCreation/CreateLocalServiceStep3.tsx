import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';

type RouteParams = {
  serviceName: string;
  description: string;
  images: string[];
  subcategoryName: string; // Use subcategoryName
  subcategoryId: string; // Extract subcategoryId
};

type CreateLocalServiceStackParamList = {
  CreateLocalServiceStep4: {
    serviceName: string;
    description: string;
    images: string[];
    price: string;
    availabilityFrom: string;
    availabilityTo: string;
    subcategoryName: string; // Use subcategoryName
    subcategoryId: string; // Pass subcategoryId
  };
};

const CreateLocalServiceStep3 = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const navigation = useNavigation<NavigationProp<CreateLocalServiceStackParamList, 'CreateLocalServiceStep4'>>();
  const { serviceName, description, images, subcategoryName, subcategoryId } = route.params; // Extract subcategoryId

  const [price, setPrice] = useState('');
  const [availabilityFrom, setAvailabilityFrom] = useState('');
  const [availabilityTo, setAvailabilityTo] = useState('');

  const handleNext = () => {
    if (images.length === 0) {
      Alert.alert('Please select at least one image');
    } else {
      navigation.navigate('CreateLocalServiceStep4', {
        serviceName,
        description,
        subcategoryName, // Pass subcategoryName
        subcategoryId, // Pass subcategoryId
        images,
        price,
        availabilityFrom,
        availabilityTo,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text>Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

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
});

export default CreateLocalServiceStep3;
