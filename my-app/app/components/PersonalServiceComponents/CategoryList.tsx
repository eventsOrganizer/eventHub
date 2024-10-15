import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  { name: 'All', icon: 'grid-outline' },
  { name: 'Cooker', icon: 'restaurant-outline' },
  { name: 'Security', icon: 'shield-checkmark-outline' },
  { name: 'Waiter', icon: 'cafe-outline' },
  { name: 'Cleaning', icon: 'brush-outline' },
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
              size={20}
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
    height: 60,
    marginBottom: 8,
  },
  categoriesScroll: {
    paddingLeft: 8,
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    padding: 4,
    borderRadius: 16,
    width: 70,
    height: 60,
  },
  selectedCategory: {
    backgroundColor: 'black',
  },
  categoryName: {
    marginTop: 2,
    fontSize: 10,
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: 'white',
  },
});

export default CategoryList;