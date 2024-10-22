import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SubcategoryList from './SubcategoryList';

interface FilterSectionProps {
  minPrice: string;
  maxPrice: string;
  setMinPrice: (price: string) => void;
  setMaxPrice: (price: string) => void;
  selectedSubcategory: number | null;
  setSelectedSubcategory: (subcategory: number | null) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  selectedSubcategory,
  setSelectedSubcategory,
}) => {
  return (
    <View>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.priceInput}
          placeholder="Min Price"
          keyboardType="numeric"
          value={minPrice}
          onChangeText={setMinPrice}
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.priceInput}
          placeholder="Max Price"
          keyboardType="numeric"
          value={maxPrice}
          onChangeText={setMaxPrice}
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.filterButton} onPress={() => console.log('Filter pressed')}>
          <Ionicons name="filter" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <SubcategoryList
        selectedSubcategory={selectedSubcategory}
        onSelectSubcategory={setSelectedSubcategory}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  priceInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 14,
    color: '#333',
  },
  filterButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FilterSection;