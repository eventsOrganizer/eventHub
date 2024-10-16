import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Icon from react-native-vector-icons

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
    <Animatable.View animation="fadeInUp" style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Spacing between the arrow and content */}
      <View style={styles.spacing} />

      <Animatable.Text animation="fadeInLeft" style={styles.label}>Price</Animatable.Text>
      <View style={styles.priceContainer}>
        <Slider
          style={styles.slider}
          minimumValue={30}
          maximumValue={2000}
          step={1}
          value={Number(price)}
          onValueChange={handlePriceChange}
          minimumTrackTintColor="#1E90FF"
          maximumTrackTintColor="#000000"
        />
        <TextInput
          style={styles.priceInput}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          maxLength={4}
        />
      </View>

      <Animatable.Text animation="fadeInLeft" style={styles.label}>Available From</Animatable.Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Availability From"
        value={availabilityFrom}
        onChangeText={setAvailabilityFrom}
      />

      <Animatable.Text animation="fadeInLeft" style={styles.label}>Available Until</Animatable.Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Availability To"
        value={availabilityTo}
        onChangeText={setAvailabilityTo}
      />

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
  label: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#333',
    color: '#fff', // Set text color to white
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
    width: 80,
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
    marginLeft: 10,
    borderRadius: 10,
    textAlign: 'center',
    backgroundColor: '#333',
    color: '#fff', // Set text color to white
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

export default CreateLocalServiceStep3;
