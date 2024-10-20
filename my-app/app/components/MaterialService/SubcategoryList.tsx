import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {MaterialIcons} from '@expo/vector-icons';
const subcategories = [
  { id: null, name: 'All', icon: 'apps-outline' },
  { id: 159, name: 'Audio Visual', icon: 'headset-outline' },
  { id: 160, name: 'Furniture', icon: 'bed-outline' },
  { id: 161, name: 'Plates', icon: 'restaurant-outline' },
  { id: 162, name: 'Cutlery', icon: 'restaurant' },
  { id: 163, name: 'Glassware', icon: 'wine' },
  { id: 164, name: 'Bar Equipment', icon: 'beer' },
  { id: 165, name: 'Cleaning', icon: 'cleaning-services' },
  { id: 166, name: 'Decoration', icon: 'star' },
  { id: 167, name: 'Tableware', icon: 'table-bar' },
];

type SubcategoryListProps = {
  selectedSubcategory: number | null;
  onSelectSubcategory: (subcategoryId: number | null) => void;
};

const SubcategoryList: React.FC<SubcategoryListProps> = ({ selectedSubcategory, onSelectSubcategory }) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subcategoriesScroll}>
        {subcategories.map((subcategory, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.subcategoryItem,
              selectedSubcategory === subcategory.id && styles.selectedSubcategory
            ]}
            onPress={() => onSelectSubcategory(subcategory.id)}
          >
            <Ionicons
              name={subcategory.icon as keyof typeof Ionicons.glyphMap}
              size={24}
              color={selectedSubcategory === subcategory.id ? "white" : "black"}
            />
            
            <Text style={[
              styles.subcategoryName,
              selectedSubcategory === subcategory.id && styles.selectedSubcategoryText
            ]}>
              {subcategory.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 80,
    marginBottom: 10,
  },
  subcategoriesScroll: {
    paddingLeft: 10,
  },
  subcategoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    padding: 10,
    borderRadius: 20,
    width: 90,
    height: 80,
    backgroundColor: '#e0e0e0',
  },
  selectedSubcategory: {
    backgroundColor: '#000',
  },
  subcategoryName: {
    marginTop: 4,
    fontSize: 10,
    textAlign: 'center',
  },
  selectedSubcategoryText: {
    color: 'white',
  },
});

export default SubcategoryList;