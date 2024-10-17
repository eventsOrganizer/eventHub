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
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
      <Text style={styles.label}>Is it for Rent or Sale?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, formData.rentOrSale === 'rent' && styles.selected]}
          onPress={() => setFormData({ ...formData, rentOrSale: 'rent' })}
        >
          <MaterialIcons name="attach-money" size={24} color={formData.rentOrSale === 'rent' ? '#fff' : '#007AFF'} />
          <Text style={[styles.buttonText, formData.rentOrSale === 'rent' && styles.selectedText]}>Rent</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, formData.rentOrSale === 'sale' && styles.selected]}
          onPress={() => setFormData({ ...formData, rentOrSale: 'sale' })}
        >
          <MaterialIcons name="shopping-cart" size={24} color={formData.rentOrSale === 'sale' ? '#fff' : '#007AFF'} />
          <Text style={[styles.buttonText, formData.rentOrSale === 'sale' && styles.selectedText]}>Sale</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
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
});

export default RentOrSaleStep;