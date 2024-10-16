import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { supabase } from '../../services/supabaseClient';
import { Formik } from 'formik';
import * as Yup from 'yup';

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
  const navigation = useNavigation<NavigationProp<CreateLocalServiceStep1Params>>();

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
    const selectedSubcategory = subcategories.find(sub => sub.id === values.subcategoryId);

    if (selectedSubcategory) {
      navigation.navigate('CreateLocalServiceStep2', { 
        serviceName: values.serviceName, 
        description: values.description, 
        subcategoryName: selectedSubcategory.name, // Pass subcategory name
        subcategoryId: selectedSubcategory.id // Pass subcategory ID
      });
    }
  };

  return (
    <Formik
      initialValues={{ serviceName: '', description: '', subcategoryId: '' }}
      validationSchema={validationSchema}
      onSubmit={(values) => handleNext(values)}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
        <View style={styles.container}>
          <Text style={styles.label}>Service Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Service Name"
            onChangeText={handleChange('serviceName')}
            onBlur={handleBlur('serviceName')}
            value={values.serviceName}
          />
          {touched.serviceName && errors.serviceName && (
            <Text style={styles.errorText}>{errors.serviceName}</Text>
          )}

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Description"
            onChangeText={handleChange('description')}
            onBlur={handleBlur('description')}
            value={values.description}
            multiline
          />
          {touched.description && errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}

          <Text style={styles.label}>Subcategory</Text>
          <Picker
            selectedValue={values.subcategoryId}
            onValueChange={(itemValue) => setFieldValue('subcategoryId', itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Select a subcategory" value="" />
            {subcategories.map((subcategory: Subcategory) => (
              <Picker.Item key={subcategory.id} label={subcategory.name} value={subcategory.id} />
            ))}
          </Picker>
          {touched.subcategoryId && errors.subcategoryId && (
            <Text style={styles.errorText}>{errors.subcategoryId}</Text>
          )}

          <Button title="Next" onPress={handleSubmit as any} />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default CreateLocalServiceStep1;
