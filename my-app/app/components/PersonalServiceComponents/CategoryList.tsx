import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../lib/theme';
import { MotiView } from 'moti';

const categories = [
  { name: 'All', icon: 'grid-outline' },
  { name: 'Cooker', icon: 'restaurant-outline' },
  { name: 'Security', icon: 'shield-checkmark-outline' },
  { name: 'Waiter', icon: 'cafe-outline' },
  { name: 'Cleaning', icon: 'brush-outline' },
  { name: 'Music team leader', icon: 'musical-notes-outline' },
];

type CategoryListProps = {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
};

const CategoryList: React.FC<CategoryListProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <BlurView intensity={90} tint="light" style={styles.container}>
      <View style={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <MotiView
            key={index}
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 100 }}
          >
            <TouchableOpacity
              style={[
                styles.categoryItem,
                selectedCategory === category.name && styles.selectedCategory
              ]}
              onPress={() => onSelectCategory(category.name === 'All' ? null : category.name)}
            >
              <Ionicons 
                name={category.icon as keyof typeof Ionicons.glyphMap} 
                size={24}
                color={selectedCategory === category.name ? theme.colors.accent : theme.colors.secondary} 
              />
              <Text style={[
                styles.categoryName,
                selectedCategory === category.name && styles.selectedCategoryText
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          </MotiView>
        ))}
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  selectedCategory: {
    backgroundColor: theme.colors.overlay,
    transform: [{ scale: 1.05 }],
  },
  categoryName: {
    marginTop: theme.spacing.xs,
    fontSize: 10,
    color: theme.colors.secondary,
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: theme.colors.accent,
    fontWeight: '600',
  },
});

export default CategoryList;