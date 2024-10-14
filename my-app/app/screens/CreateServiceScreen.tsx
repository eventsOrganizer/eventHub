import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { supabase } from '../services/supabaseClient';

interface CreateServiceScreenProps {
  navigation: any;
  route: any;
}

const CreateServiceScreen: React.FC<CreateServiceScreenProps> = ({ navigation, route }) => {
  const { serviceType } = route.params; // Fetch serviceType (local, material, person)
  const [serviceName, setServiceName] = useState<string>('');
  const [serviceDescription, setServiceDescription] = useState<string>('');

  // Handle the creation of a new service
  const handleCreateService = async () => {
    if (!serviceName || !serviceDescription) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // Insert the service into the database
      const { data, error } = await supabase
        .from('personal') // Assuming 'personal' table is where services are stored
        .insert([{ name: serviceName, details: serviceDescription, type: serviceType }]);

      if (error) {
        throw error; // If there's an error, throw it
      }

      // Success handling
      Alert.alert('Success', `Created ${serviceType} service successfully`);
      navigation.goBack(); // Navigate back to the previous screen
    } catch (error: unknown) {
      // Handle error gracefully
      if (error instanceof Error) {
        Alert.alert('Error', error.message || 'An unexpected error occurred');
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create {serviceType} Service</Text>
      
      {/* Service Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Service Name"
        value={serviceName}
        onChangeText={setServiceName}
      />
      
      {/* Service Description Input */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Service Description"
        value={serviceDescription}
        onChangeText={setServiceDescription}
        multiline
      />
      
      {/* Create Service Button */}
      <TouchableOpacity style={styles.button} onPress={handleCreateService}>
        <Text style={styles.buttonText}>Create Service</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: '#673AB7',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateServiceScreen;
