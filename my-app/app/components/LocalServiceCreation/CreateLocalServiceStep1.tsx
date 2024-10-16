import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { supabase } from '../../services/supabaseClient';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as Animatable from 'react-native-animatable';

type CreateLocalServiceStep1Params = {
  CreateLocalServiceStep2: {
    serviceName: string;
    description: string;
    subcategoryName: string;
    subcategoryId: string;
  };
};

type Subcategory = {
  id: string;
  name: string;
};

// Yup validation schema
const validationSchema = Yup.object().shape({
  serviceName: Yup.string().required('Service Name is required'),
  description: Yup.string().required('Description is required'),
  subcategoryId: Yup.string().required('Subcategory is required'),
});

const CreateLocalServiceStep1 = () => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigation = useNavigation<NavigationProp<CreateLocalServiceStep1Params>>();
  const containerRef = useRef<Animatable.View | null>(null); // Reference for the container

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const { data: categoryData, error: categoryError } = await supabase
          .from('category')
          .select('id')
          .eq('name', 'Local')
          .single();

        if (categoryError) throw categoryError;

        const { data: subcategories, error: subcategoryError } = await supabase
          .from('subcategory')
          .select('*')
          .eq('category_id', categoryData.id);

        if (subcategoryError) throw subcategoryError;

        setSubcategories(subcategories as any);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchSubcategories();
  }, []);

  const handleNext = (values: { serviceName: string; description: string; subcategoryId: string }) => {
    const selectedSubcategoryData = subcategories.find(sub => sub.id === values.subcategoryId);

    if (selectedSubcategoryData) {
      if (containerRef.current?.fadeOut) { // Check if fadeOut is defined
        containerRef.current.fadeOut(300).then(() => { // Animate fade out
          navigation.navigate('CreateLocalServiceStep2', { 
            serviceName: values.serviceName, 
            description: values.description, 
            subcategoryName: selectedSubcategoryData.name,
            subcategoryId: selectedSubcategoryData.id 
          });
        });
      }
    }
  };

  return (
    <Formik
      initialValues={{ serviceName: '', description: '', subcategoryId: '' }}
      validationSchema={validationSchema}
      onSubmit={(values) => handleNext(values)}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
        <Animatable.View ref={containerRef} animation="fadeInUp" style={styles.container}>
          {/* Service Name Input */}
          <Animatable.Text animation="fadeInLeft" style={styles.label}>Service Name</Animatable.Text>
          <Animatable.View animation="bounceIn" delay={100}>
            <TextInput
              style={[styles.input, touched.serviceName && errors.serviceName ? styles.inputError : null]}
              placeholder="Enter Service Name"
              placeholderTextColor="#999"
              onChangeText={handleChange('serviceName')}
              onBlur={handleBlur('serviceName')}
              value={values.serviceName}
            />
            {touched.serviceName && errors.serviceName && (
              <Animatable.Text animation="fadeIn" style={styles.errorText}>{errors.serviceName}</Animatable.Text>
            )}
          </Animatable.View>

          {/* Description Input */}
          <Animatable.Text animation="fadeInLeft" style={styles.label}>Description</Animatable.Text>
          <Animatable.View animation="bounceIn" delay={200}>
            <TextInput
              style={[styles.input, touched.description && errors.description ? styles.inputError : null]}
              placeholder="Enter Description"
              placeholderTextColor="#999"
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description}
              multiline
            />
            {touched.description && errors.description && (
              <Animatable.Text animation="fadeIn" style={styles.errorText}>{errors.description}</Animatable.Text>
            )}
          </Animatable.View>

          {/* Subcategory Dropdown */}
          <Animatable.Text animation="fadeInLeft" style={styles.label}>Subcategory</Animatable.Text>
          <TouchableOpacity
            style={[styles.dropdown, { borderColor: selectedSubcategory ? '#fff' : '#FF3B30' }]}
            onPress={() => setDropdownVisible(prev => !prev)}
          >
            <Text style={styles.dropdownText}>
              {selectedSubcategory || "Select a subcategory"}
            </Text>
          </TouchableOpacity>

          {dropdownVisible && (
            <FlatList
              data={subcategories}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedSubcategory(item.name);
                    setFieldValue('subcategoryId', item.id);
                    setDropdownVisible(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {touched.subcategoryId && errors.subcategoryId && (
            <Animatable.Text animation="fadeIn" style={styles.errorText}>{errors.subcategoryId}</Animatable.Text>
          )}

          {/* Submit Button */}
          <Animatable.View animation="pulse" delay={400} style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit as any}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </Animatable.View>
        </Animatable.View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#000',
  },
  label: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    color: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#333',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#333',
    marginBottom: 10,
  },
  dropdownText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownItem: {
    padding: 10,
    backgroundColor: '#444',
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  dropdownItemText: {
    color: '#fff',
  },
  errorText: {
    color: '#FF3B30', 
    marginBottom: 10,
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#FF3B30', 
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#FF3B30', 
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.8, 
    shadowRadius: 10,
  },
  buttonText: {
    color: '#fff', 
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateLocalServiceStep1;
