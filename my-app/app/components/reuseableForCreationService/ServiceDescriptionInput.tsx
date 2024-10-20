import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface ServiceDescriptionInputProps {
  description: string;
  setDescription: (description: string) => void;
}

const ServiceDescriptionInput: React.FC<ServiceDescriptionInputProps> = ({ description, setDescription }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Entrez la description du service"
        multiline
        numberOfLines={4}
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
    height: 100,
    textAlignVertical: 'top',
  },
});

export default ServiceDescriptionInput;