import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

interface PriceStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

const PriceStep: React.FC<PriceStepProps> = ({ formData, setFormData }) => {
  return (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
      <Text style={styles.label}>
        {formData.rentOrSale === 'rent' ? 'Price Per Hour' : 'Sale Price'}
      </Text>
      <TextInput
        style={styles.input}
        placeholder={formData.rentOrSale === 'rent' ? '$/hour' : '$'}
        value={formData.price}
        keyboardType="numeric"
        onChangeText={(text) => setFormData({ ...formData, price: text })}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
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
});

export default PriceStep;