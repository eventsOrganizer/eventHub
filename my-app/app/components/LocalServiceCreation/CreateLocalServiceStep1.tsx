import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { supabase } from '../../services/supabaseClient';

type CreateLocalServiceStep1Params = {
  CreateLocalServiceStep2: {
    serviceName: string;
    description: string;
    subcategoryName: string; // Change from subcategoryId to subcategoryName
    subcategoryId: string; // Pass subcategory ID
  };
};

type Subcategory = {
  id: string;
  name: string;
};

const CreateLocalServiceStep1 = () => {
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null); // Change to store the whole subcategory
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

  const handleNext = () => {
    if (serviceName && description && selectedSubcategory) {
      navigation.navigate('CreateLocalServiceStep2', { 
        serviceName, 
        description, 
        subcategoryName: selectedSubcategory.name, // Pass subcategory name
        subcategoryId: selectedSubcategory.id // Pass subcategory ID
      });
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Service Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Service Name"
        value={serviceName}
        onChangeText={setServiceName}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Text style={styles.label}>Subcategory</Text>
      <Picker
        selectedValue={selectedSubcategory ? selectedSubcategory.id : null} // Update to work with selectedSubcategory
        onValueChange={(itemValue) => {
          const selected = subcategories.find(sub => sub.id === itemValue); // Find the selected subcategory
          setSelectedSubcategory(selected || null); // Set the whole subcategory object
        }}
        style={styles.input}
      >
        <Picker.Item label="Select a subcategory" value={null} />
        {subcategories.map((subcategory: Subcategory) => (
          <Picker.Item key={subcategory.id} label={subcategory.name} value={subcategory.id} />
        ))}
      </Picker>
      <Button title="Next" onPress={handleNext} />
    </View>
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
});

export default CreateLocalServiceStep1;
