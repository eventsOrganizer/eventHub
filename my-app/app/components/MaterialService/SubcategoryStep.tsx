import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

interface SubcategoryStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

const SubcategoryStep: React.FC<SubcategoryStepProps> = ({ formData, setFormData }) => {
  return (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.container}>
      <Text style={styles.label}>Choose Subcategory</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.subcategory}
          onValueChange={(itemValue) => setFormData({ ...formData, subcategory: itemValue })}
          style={styles.picker}
        >
          <Picker.Item label="Select Subcategory" value="" />
          <Picker.Item label="Audio Visual" value="Audio Visual" />
          <Picker.Item label="Furniture" value="Furniture" />
          <Picker.Item label="Plates" value="Plates" />
          <Picker.Item label="Cutlery" value="Cutlery" />
          <Picker.Item label="Glassware" value="Glassware" />
          <Picker.Item label="Bar Equipment" value="Bar Equipment" />
          <Picker.Item label="Cleaning" value="Cleaning" />
          <Picker.Item label="Decoration" value="Decoration" />
          <Picker.Item label="Tableware" value="Tableware" />
        </Picker>
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
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#fff',
  },
});

export default SubcategoryStep;