import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Calendar, ShoppingCart } from 'lucide-react-native';

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
  { id: 'rent', name: 'Rent', icon: 'calendar' },
  { id: 'sell', name: 'Sell', icon: 'shopping-cart' },
];

type SubcategoryListProps = {
  selectedSubcategory: number | string | null;
  onSelectSubcategory: (subcategoryId: number | string | null) => void;
};

const SubcategoryList: React.FC<SubcategoryListProps> = ({ selectedSubcategory, onSelectSubcategory }) => {
  const renderIcon = (subcategory: typeof subcategories[0]) => {
    const iconColor = selectedSubcategory === subcategory.id ? "white" : "#4A90E2";
    
    if (subcategory.icon === 'calendar') {
      return <Calendar size={24} color={iconColor} />;
    } else if (subcategory.icon === 'shopping-cart') {
      return <ShoppingCart size={24} color={iconColor} />;
    } else if (subcategory.icon.includes('cleaning') || subcategory.icon.includes('table')) {
      return (
        <MaterialIcons
          name={subcategory.icon as keyof typeof MaterialIcons.glyphMap}
          size={24}
          color={iconColor}
        />
      );
    } else {
      return (
        <Ionicons
          name={subcategory.icon as keyof typeof Ionicons.glyphMap}
          size={24}
          color={iconColor}
        />
      );
    }
  };

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
            {renderIcon(subcategory)}
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
    borderRadius: 10,
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedSubcategory: {
    backgroundColor: '#4A90E2',
  },
  subcategoryName: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
    color: '#4A90E2',
  },
  selectedSubcategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SubcategoryList;