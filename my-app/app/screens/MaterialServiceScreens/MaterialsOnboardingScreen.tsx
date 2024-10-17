import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';

const MaterialsOnboardingScreen: React.FC = () => {
  const [step, setStep] = useState(1);
  const [subcategory, setSubcategory] = useState('');
  const [rentOrSale, setRentOrSale] = useState('');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const handleNext = () => {
    if (step === 1 && !subcategory) {
      Alert.alert('Error', 'Please select a subcategory');
      return;
    }
    if (step === 2 && !rentOrSale) {
      Alert.alert('Error', 'Please choose rent or sale');
      return;
    }
    if (step === 3 && (!title || !details)) {
      Alert.alert('Error', 'Please fill in the title and details');
      return;
    }
    if (step === 4 && !price) {
      Alert.alert('Error', 'Please provide the price');
      return;
    }
    setStep((prevStep) => prevStep + 1);
  };

  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleFinish = () => {
    Alert.alert('Success', 'Your material service has been created!');
    setStep(1);
    setSubcategory('');
    setRentOrSale('');
    setTitle('');
    setDetails('');
    setPrice('');
    setImage(null);
  };

  const isNextDisabled = () => {
    if (step === 1 && !subcategory) return true;
    if (step === 2 && !rentOrSale) return true;
    if (step === 3 && (!title || !details)) return true;
    if (step === 4 && !price) return true;
    return false;
  };

  const steps = ['Subcategory', 'Rent or Sale', 'Material Details', 'Price'];

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
            <Text style={styles.label}>Choose Subcategory</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={subcategory}
                onValueChange={(itemValue) => setSubcategory(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Subcategory" value="" />
                <Picker.Item label="Sound Equipment" value="sound" />
                <Picker.Item label="Lighting" value="lighting" />
                <Picker.Item label="Tents" value="tents" />
              </Picker>
            </View>
          </Animated.View>
        );
      case 2:
        return (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
            <Text style={styles.label}>Is it for Rent or Sale?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, rentOrSale === 'rent' && styles.selected]}
                onPress={() => setRentOrSale('rent')}
              >
                <MaterialIcons name="attach-money" size={24} color={rentOrSale === 'rent' ? '#fff' : '#007AFF'} />
                <Text style={[styles.buttonText, rentOrSale === 'rent' && styles.selectedText]}>Rent</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, rentOrSale === 'sale' && styles.selected]}
                onPress={() => setRentOrSale('sale')}
              >
                <MaterialIcons name="shopping-cart" size={24} color={rentOrSale === 'sale' ? '#fff' : '#007AFF'} />
                <Text style={[styles.buttonText, rentOrSale === 'sale' && styles.selectedText]}>Sale</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        );
      case 3:
        return (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
            <Text style={styles.label}>Material Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter title"
              value={title}
              onChangeText={(text) => setTitle(text)}
            />
            <Text style={styles.label}>Material Details</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter details"
              value={details}
              onChangeText={(text) => setDetails(text)}
              multiline
              numberOfLines={4}
            />
            <Text style={styles.label}>Upload a Photo</Text>
            <TouchableOpacity onPress={handleImageUpload} style={styles.uploadButton}>
              <MaterialIcons name="cloud-upload" size={24} color="#007AFF" />
              <Text style={styles.uploadText}>Choose Photo</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.image} />}
          </Animated.View>
        );
      case 4:
        return (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
            <Text style={styles.label}>
              {rentOrSale === 'rent' ? 'Price Per Hour' : 'Sale Price'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={rentOrSale === 'rent' ? '$/hour' : '$'}
              value={price}
              keyboardType="numeric"
              onChangeText={(text) => setPrice(text)}
            />
          </Animated.View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.progressContainer}>
        {steps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressStep,
              index < step && styles.progressStepCompleted,
            ]}
          />
        ))}
      </View>
      <Text style={styles.stepIndicator}>
        Step {step} of {steps.length}: {steps[step - 1]}
      </Text>

      {renderStepContent()}

      <TouchableOpacity
        style={[styles.nextButton, isNextDisabled() && styles.disabledButton]}
        onPress={step < 4 ? handleNext : handleFinish}
        disabled={isNextDisabled()}
      >
        <Text style={styles.nextButtonText}>
          {step < 4 ? 'Next' : 'Finish'}
        </Text>
        <MaterialIcons
          name={step < 4 ? 'arrow-forward' : 'check'}
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  progressStep: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
  },
  progressStepCompleted: {
    backgroundColor: '#007AFF',
  },
  stepIndicator: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  selected: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 10,
  },
  selectedText: {
    color: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  uploadText: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default MaterialsOnboardingScreen;