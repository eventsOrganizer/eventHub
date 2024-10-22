import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

interface PriceStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

const PriceStep: React.FC<PriceStepProps> = ({ formData, setFormData }) => {
  return (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.container}>
      <Text style={styles.label}>
        {formData.rentOrSale === 'rent' ? 'Price Per Hour' : 'Sale Price'}
      </Text>
      <TextInput
        style={styles.input}
        placeholder={formData.rentOrSale === 'rent' ? '$/hour' : '$'}
        placeholderTextColor="#a0a0a0"
        value={formData.price}
        keyboardType="numeric"
        onChangeText={(text) => setFormData({ ...formData, price: text })}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  input: {
    height: 50,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
  },
});

export default PriceStep;