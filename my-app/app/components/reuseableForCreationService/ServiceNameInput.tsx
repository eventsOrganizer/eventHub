import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface ServiceNameInputProps {
  serviceName: string;
  setServiceName: (name: string) => void;
}

const ServiceNameInput: React.FC<ServiceNameInputProps> = ({ serviceName, setServiceName }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name of the service person</Text>
      <TextInput
        style={styles.input}
        value={serviceName}
        onChangeText={setServiceName}
        placeholder="Enter the name of the service person"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
});

export default ServiceNameInput;