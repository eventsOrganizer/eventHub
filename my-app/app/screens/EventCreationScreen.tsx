import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';  // Ensure you're importing from the right package
import { supabase } from '../services/supabaseClient';  // Assuming you have a Supabase instance exported

const EventCreationScreen = ({ navigation }: any) => {
  const [categories, setCategories] = useState<any[]>([]);  // State to store categories
  const [selectedCategory, setSelectedCategory] = useState<string>('');  // Selected category
  const [subcategories, setSubcategories] = useState<any[]>([]);  // State to store subcategories

  // Fetch categories on screen load
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('category')
        .select('*');
      
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories based on selected category
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (selectedCategory) {
        const { data, error } = await supabase
          .from('subcategory')
          .select('*')
          .eq('category_id', selectedCategory);
        
        if (error) {
          Alert.alert('Error', error.message);
        } else {
          setSubcategories(data);
        }
      }
    };

    fetchSubcategories();
  }, [selectedCategory]);  // Run this effect when selectedCategory changes

  const handleNext = () => {
    if (selectedCategory) {
      // Proceed to the next screen with selected category
      navigation.navigate('SubcategorySelection', { selectedCategory });
    } else {
      Alert.alert('Validation Error', 'Please select a category');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create New Event</Text>

      {/* Category Picker */}
      <Text style={styles.label}>Select Event Category</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Category" value="" />
          {categories.map((category) => (
            <Picker.Item key={category.id} label={category.name} value={category.id} />
          ))}
        </Picker>
      </View>

      {/* Subcategory Picker */}
      {selectedCategory && (
        <>
          <Text style={styles.label}>Select Event Subcategory</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Subcategory" value="" />
              {subcategories.map((subcategory) => (
                <Picker.Item key={subcategory.id} label={subcategory.name} value={subcategory.id} />
              ))}
            </Picker>
          </View>
        </>
      )}

      <Button title="Next" onPress={handleNext} color="#4CAF50" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  pickerContainer: {
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default EventCreationScreen;
