import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface SubcategoryStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

const subcategories = [
  { id: 'audioVisual', label: 'Audio Visual', icon: 'headset' },
  { id: 'furniture', label: 'Furniture', icon: 'bed' },
  { id: 'plates', label: 'Plates', icon: 'restaurant' },
  { id: 'cutlery', label: 'Cutlery', icon: 'restaurant-outline' },
  { id: 'glassware', label: 'Glassware', icon: 'wine' },
  { id: 'barEquipment', label: 'Bar Equipment', icon: 'beer' },
  { id: 'cleaning', label: 'Cleaning', icon: 'brush' },
  { id: 'decoration', label: 'Decoration', icon: 'color-palette' },
  { id: 'tableware', label: 'Tableware', icon: 'cafe' },
];

const SubcategoryStep: React.FC<SubcategoryStepProps> = ({ formData, setFormData }) => {
  return (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.container}>
      <Text style={styles.label}>Choose Subcategory</Text>
      <ScrollView contentContainerStyle={styles.gridContainer}>
        {subcategories.map((subcategory) => (
          <TouchableOpacity
            key={subcategory.id}
            style={[
              styles.iconContainer,
              formData.subcategory === subcategory.id && styles.selectedIconContainer,
            ]}
            onPress={() => setFormData({ ...formData, subcategory: subcategory.id })}
          >
            <Ionicons
              name={subcategory.icon as any}
              size={32}
              color={formData.subcategory === subcategory.id ? '#4A90E2' : '#fff'}
            />
            <Text style={styles.iconLabel}>{subcategory.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  iconLabel: {
    marginTop: 5,
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
});

export default SubcategoryStep;