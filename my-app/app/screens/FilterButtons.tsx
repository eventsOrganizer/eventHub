import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface FilterButtonsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <View style={styles.filterContainer}>
      <TouchableOpacity onPress={() => onSelectCategory('All')} style={styles.filterButton}>
        <Icon name="filter-list" size={24} color={selectedCategory === 'All' ? '#4CAF50' : '#000'} />
        <Text style={[styles.filterText, selectedCategory === 'All' && styles.activeFilterText]}>All</Text>
      </TouchableOpacity>
      {['Local', 'Personal', 'Material'].map((category) => (
        <TouchableOpacity 
          key={category}
          onPress={() => onSelectCategory(category)} 
          style={styles.filterButton}
        >
          <Icon 
            name={category === 'Personal' ? 'person' : category === 'Local' ? 'location-on' : 'shopping-cart'} 
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