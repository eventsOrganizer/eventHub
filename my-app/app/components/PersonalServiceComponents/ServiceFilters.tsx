import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import CategoryList from '../PersonalServiceComponents/CategoryList';

interface ServiceFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    minPrice: string;
    setMinPrice: (price: string) => void;
    maxPrice: string;
    setMaxPrice: (price: string) => void;
    selectedCategory: string | null;
    setSelectedCategory: (category: string | null) => void;
  }
  
  const ServiceFilters: React.FC<ServiceFiltersProps> = ({
    searchQuery,
    setSearchQuery,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    selectedCategory,
    setSelectedCategory,
  }) => {
    return (
      <View>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search staff services"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View style={styles.priceFilter}>
          <TextInput
            style={styles.priceInput}
            placeholder="Min price"
            value={minPrice}
            onChangeText={setMinPrice}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.priceInput}
            placeholder="Max price"
            value={maxPrice}
            onChangeText={setMaxPrice}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.categoryListContainer}>
          <CategoryList selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    searchBar: {
      backgroundColor: '#fff',
      borderRadius: 20,
      margin: 10,
      paddingHorizontal: 15,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    searchInput: {
      paddingVertical: 10,
    },
    priceFilter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 10,
      marginBottom: 10,
    },
    priceInput: {
      flex: 1,
      backgroundColor: '#fff',
      borderRadius: 20,
      paddingHorizontal: 15,
      paddingVertical: 8,
      marginRight: 10,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    categoryListContainer: {
      height: 80, // Adjust this value based on your CategoryList height
    },
  });
  
  export default ServiceFilters;