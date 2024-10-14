import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';  // Ensure you're using the correct Picker package
import { supabase } from '../services/supabaseClient';

const CategorySelectionScreen = ({ route, navigation }: any) => {
  const { eventName, eventDescription, eventType } = route.params;
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('category')
        .select('*')
        .eq('type', 'event');

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  const handleNext = () => {
    if (selectedCategory) {
      navigation.navigate('SubcategorySelection', {
        eventName,
        eventDescription,
        eventType,
        selectedCategory,
      });
    } else {
      Alert.alert('Error', 'Please select a category');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Event Category</Text>

      {/* Wrap the Picker in a View container for layout */}
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={setSelectedCategory}
          style={styles.picker}
        >
          <Picker.Item label="Select Category" value={null} />
          {categories.map((category) => (
            <Picker.Item
              key={category.id}
              label={category.name}
              value={category.id}
            />
          ))}
        </Picker>
      </View>

      <Button title="Next" onPress={handleNext} color="#4CAF50" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pickerWrapper: {
    height: 50, // Apply height here, not directly to Picker
    marginBottom: 15, // Apply marginBottom here
    justifyContent: 'center',
  },
  picker: {
    height: 50, // Now only set properties allowed on the Picker itself
    width: '100%', // Ensuring the picker stretches to the full width
  },
});

export default CategorySelectionScreen;
