import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface Category {
  id: number;
  name: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Catégorie</Text>
      <Picker
        selectedValue={selectedCategory ? selectedCategory.id : undefined}
        onValueChange={(itemValue) => {
          const selected = categories.find(cat => cat.id === itemValue);
          setSelectedCategory(selected || null);
        }}
        style={styles.picker}
      >
        <Picker.Item label="Select a category" value={undefined} />
        {categories.map((category) => (
          <Picker.Item key={category.id} label={category.name} value={category.id} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default CategorySelector;