import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  { name: 'All', icon: 'grid-outline' },
  { name: 'Catering Services', icon: 'restaurant-outline' },
  { name: 'Security Personnel', icon: 'shield-checkmark-outline' },
  { name: 'Technical Support', icon: 'construct-outline' },
  { name: 'Entertainment & Performers', icon: 'musical-notes-outline' },
  { name: 'Transport & Logistics', icon: 'car-outline' },
  { name: 'Cleaning & Maintenance', icon: 'broom-outline' },
  { name: 'Decor & Design', icon: 'color-palette-outline' },
  { name: 'Photography & Videography', icon: 'camera-outline' },
];

type CategoryListProps = {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
};

const CategoryList: React.FC<CategoryListProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryItem,
              selectedCategory === category.name && styles.selectedCategory
            ]}
            onPress={() => onSelectCategory(category.name === 'All' ? null : category.name)}
          >
            <Ionicons 
              name={category.icon as keyof typeof Ionicons.glyphMap} 
              size={24} // Increased from 16 to 24
              color={selectedCategory === category.name ? "white" : "black"} 
            />
            <Text style={[
              styles.categoryName,
              selectedCategory === category.name && styles.selectedCategoryText
            ]}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 80, // Increased from 70 to 80
    marginBottom: 10,
  },
  categoriesScroll: {
    paddingLeft: 10,
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    padding: 5,
    borderRadius: 20,
    width: 90, // Increased from 80 to 90
    height: 80, // Increased from 70 to 80
  },
  selectedCategory: {
    backgroundColor: 'black',
  },
  categoryName: {
    marginTop: 4, // Increased from 2 to 4
    fontSize: 10, // Increased from 9 to 10
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: 'white',
  },
});

export default CategoryList;