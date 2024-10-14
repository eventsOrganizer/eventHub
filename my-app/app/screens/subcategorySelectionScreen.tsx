import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../services/supabaseClient';
import RNPickerSelect from 'react-native-picker-select'; // Correct import

const SubcategorySelectionScreen = ({ route, navigation }: any) => {
  const { eventName, eventDescription, eventType, selectedCategory } = route.params;
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<any>(null);

  useEffect(() => {
    const fetchSubcategories = async () => {
      const { data, error } = await supabase
        .from('subcategory')
        .select('*')
        .eq('category_id', selectedCategory);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setSubcategories(data);
      }
    };

    fetchSubcategories();
  }, [selectedCategory]);

  const handleNext = () => {
    if (selectedSubcategory) {
      navigation.navigate('EventSetupOptions', {
        eventName,
        eventDescription,
        eventType,
        selectedCategory,
        selectedSubcategory
      });
    } else {
      Alert.alert('Error', 'Please select a subcategory');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Subcategory</Text>

      {/* Correct usage of RNPickerSelect */}
      <RNPickerSelect
        value={selectedSubcategory}
        onValueChange={setSelectedSubcategory}
        style={pickerSelectStyles}
        placeholder={{ label: 'Select Subcategory', value: null }}
        items={subcategories.map(subcategory => ({
          label: subcategory.name,
          value: subcategory.id,
        }))}
      />

      <Button title="Next" onPress={handleNext} color="#4CAF50" />
    </View>
  );
};

// Correct styling for RNPickerSelect
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
  },
  inputAndroid: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
  },
  placeholder: {
    color: '#888',
    fontSize: 16,
  },
});

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
});

export default SubcategorySelectionScreen;
