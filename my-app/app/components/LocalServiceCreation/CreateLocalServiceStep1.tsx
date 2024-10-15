import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Updated import
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { supabase } from '../../services/supabaseClient'; // Adjust the import path as necessary

type CreateLocalServiceStep1Params = {
  CreateLocalServiceStep2: {
    serviceName: string;
    description: string;
    subcategoryId: number;
  };
};

type Subcategory = {
  id: string; // or number, depending on your data
  name: string;
};

const CreateLocalServiceStep1 = () => {
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
  const navigation = useNavigation<NavigationProp<CreateLocalServiceStep1Params>>();

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        // Fetch the category with type 'local'
        const { data: categoryData, error: categoryError } = await supabase
          .from('category')
          .select('id')
          .eq('name', 'Local')
          .single();

        if (categoryError) throw categoryError;

        // Fetch subcategories related to the 'local' category
        const { data: subcategories, error: subcategoryError } = await supabase
          .from('subcategory')
          .select('*')
          .eq('category_id', categoryData.id);

        if (subcategoryError) throw subcategoryError;

        setSubcategories(subcategories as any); // Cast to any to avoid TypeScript error
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchSubcategories();
  }, []);

  const handleNext = () => {
    if (serviceName && description && selectedSubcategory !== null) {
      navigation.navigate('CreateLocalServiceStep2', { serviceName, description, subcategoryId: selectedSubcategory });
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
        selectedValue={selectedSubcategory}
        onValueChange={(itemValue) => setSelectedSubcategory(itemValue)}
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
