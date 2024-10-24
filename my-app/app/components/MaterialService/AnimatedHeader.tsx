import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import Header from './Header';
import SubcategoryList from './SubcategoryList';
import { PriceFilter } from './PriceFilter';

interface AnimatedHeaderProps {
  headerOpacity: Animated.AnimatedInterpolation<string | number>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  basketCount: number;
  onBasketPress: () => void;
  selectedSubcategory: number | string | null;
  onSelectSubcategory: (category: number | string | null) => void;
  minPrice: string;
  maxPrice: string;
  setMinPrice: (price: string) => void;
  setMaxPrice: (price: string) => void;
}

export const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  headerOpacity,
  searchQuery,
  setSearchQuery,
  basketCount,
  onBasketPress,
  selectedSubcategory,
  onSelectSubcategory,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
}) => {
  return (
    <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        basketCount={basketCount}
        onBasketPress={onBasketPress}
      />
      <SubcategoryList
        selectedSubcategory={selectedSubcategory}
        onSelectSubcategory={onSelectSubcategory}
      />
      <PriceFilter
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        onApply={() => {/* Apply filter logic */}}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
    paddingBottom: 8,
  },
});