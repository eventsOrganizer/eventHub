import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export interface FilterButtonsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ selectedCategory, onSelectCategory, categories }) => {
  return (
    <View style={styles.filterContainer}>
      {categories.map((category) => (
        <TouchableOpacity 
          key={category}
          onPress={() => onSelectCategory(category)} 
          style={styles.filterButton}
        >
          <Icon 
            name={
              category === 'All' ? 'filter-list' :
              category === 'Personal' ? 'person' : 
              category === 'Local' ? 'location-on' : 
              'shopping-cart'
            } 
            size={24} 
            color={selectedCategory === category ? '#4CAF50' : '#000'} 
          />
          <Text style={[styles.filterText, selectedCategory === category && styles.activeFilterText]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 12,
    color: '#000',
  },
  activeFilterText: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default FilterButtons;
