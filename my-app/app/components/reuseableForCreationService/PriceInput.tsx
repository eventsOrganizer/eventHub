import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface PriceInputProps {
  price: string;
  setPrice: (price: string) => void;
  label?: string;
}

const PriceInput: React.FC<PriceInputProps> = ({ price, setPrice }) => {
  return (
    <TextInput
      style={styles.input}
      value={price}
      onChangeText={setPrice}
      keyboardType="numeric"
      placeholder="Enter price"
      placeholderTextColor="rgba(255, 255, 255, 0.5)"
    />
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

export default PriceInput;
