import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

interface RentOrSaleStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

const RentOrSaleStep: React.FC<RentOrSaleStepProps> = ({ formData, setFormData }) => {
  return (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.container}>
      <Text style={styles.label}>Is it for Rent or Sale?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, formData.rentOrSale === 'rent' && styles.selected]}
          onPress={() => setFormData({ ...formData, rentOrSale: 'rent' })}
        >
          <MaterialIcons name="attach-money" size={24} color={formData.rentOrSale === 'rent' ? '#192f6a' : '#fff'} />
          <Text style={[styles.buttonText, formData.rentOrSale === 'rent' && styles.selectedText]}>Rent</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, formData.rentOrSale === 'sale' && styles.selected]}
          onPress={() => setFormData({ ...formData, rentOrSale: 'sale' })}
        >
          <MaterialIcons name="shopping-cart" size={24} color={formData.rentOrSale === 'sale' ? '#192f6a' : '#fff'} />
          <Text style={[styles.buttonText, formData.rentOrSale === 'sale' && styles.selectedText]}>Sale</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 15,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  selected: {
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  selectedText: {
    color: '#192f6a',
  },
});

export default RentOrSaleStep;