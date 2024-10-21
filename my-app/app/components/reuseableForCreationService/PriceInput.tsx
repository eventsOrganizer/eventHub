import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface PriceInputProps {
  price: string;
  setPrice: (price: string) => void;
  label?: string;
}

const PriceInput: React.FC<PriceInputProps> = ({ price, setPrice, label = "Prix par heure" }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholder="Enter the price"
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

export default PriceInput;