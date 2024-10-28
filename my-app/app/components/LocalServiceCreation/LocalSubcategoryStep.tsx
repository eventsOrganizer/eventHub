import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import LocalNextButton from './LocalNextButton'; // Import your button

interface LocalSubcategoryStepProps {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
}

const localSubcategories = [
  { id: 'Restaurant', label: 'Restaurant', icon: 'restaurant' },
  { id: 'Mansion', label: 'Mansion', icon: 'home' },
  { id: 'Hotel', label: 'Hotel', icon: 'bed' },
];

// Validation schema with Formik and Yup
const validationSchema = Yup.object().shape({
  subcategory: Yup.string().required('Subcategory is required'), // This will trigger validation
});

const LocalSubcategoryStep: React.FC<LocalSubcategoryStepProps> = ({ formData, setFormData, onNext }) => {
  return (
    <Formik
      initialValues={{ subcategory: formData.subcategory }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        setFormData({ ...formData, subcategory: values.subcategory });
        onNext(); // Proceed to the next step
      }}
    >
      {({ handleSubmit, setFieldValue, values, errors, touched }) => (
        <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.container}>
          <Text style={styles.label}>Choose Local Subcategory</Text>
          <ScrollView contentContainerStyle={styles.gridContainer}>
            {localSubcategories.map((subcategory) => (
              <TouchableOpacity
                key={subcategory.id}
                style={[
                  styles.iconContainer,
                  values.subcategory === subcategory.id && styles.selectedIconContainer,
                ]}
                onPress={() => setFieldValue('subcategory', subcategory.id)}
              >
                <Ionicons
                  name={subcategory.icon as any}
                  size={32}
                  color={values.subcategory === subcategory.id ? '#4A90E2' : '#fff'}
                />
                <Text style={styles.iconLabel}>{subcategory.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Show error if subcategory is not selected */}
          {touched.subcategory && errors.subcategory && (
            <Text style={styles.errorText}>{errors.subcategory}</Text>
          )}

          <LocalNextButton onPress={handleSubmit} disabled={false} isLastStep={false} />
        </Animated.View>
      )}
    </Formik>
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
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default LocalSubcategoryStep;
