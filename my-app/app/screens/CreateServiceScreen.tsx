import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../services/supabaseClient';
import { Ionicons } from '@expo/vector-icons';

interface CreateServiceScreenProps {
  navigation: any;
}

const CreateServiceScreen: React.FC<CreateServiceScreenProps> = ({ navigation }) => {
  const [serviceType, setServiceType] = useState<string>('');
  const [serviceName, setServiceName] = useState<string>('');
  const [serviceDescription, setServiceDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');

  const handleCreateService = async () => {
    if (!serviceType || !serviceName || !serviceDescription || !price) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from(serviceType)
        .insert([{ name: serviceName, details: serviceDescription, price: parseFloat(price) }]);

      if (error) {
        throw error;
      }

      Alert.alert('Success', `Created ${serviceType} service successfully`);
      navigation.goBack();
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message || 'An unexpected error occurred');
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create New Service</Text>

      <Text style={styles.label}>Service Type</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={serviceType}
          onValueChange={(itemValue) => setServiceType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Service Type" value="" />
          <Picker.Item label="Local Service" value="local" />
          <Picker.Item label="Personal Service" value="personal" />
          <Picker.Item label="Material Service" value="material" />
        </Picker>
      </View>

      <Text style={styles.label}>Service Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter service name"
        value={serviceName}
        onChangeText={setServiceName}
      />

      <Text style={styles.label}>Service Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter service description"
        value={serviceDescription}
        onChangeText={setServiceDescription}
        multiline
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.createButton} onPress={handleCreateService}>
        <Text style={styles.createButtonText}>Create Service</Text>
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
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  pickerContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateServiceScreen;