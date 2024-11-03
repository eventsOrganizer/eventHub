import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BlurView } from 'expo-blur';
import { supabase } from '../../../../services/supabaseClient';
import tw from 'twrnc';

interface CategorySubcategorySelectorProps {
  selectedCategory: string;
  selectedSubcategory: string;
  onCategoryChange: (categoryId: string) => void;
  onSubcategoryChange: (subcategoryId: string) => void;
}

export const CategorySubcategorySelector: React.FC<CategorySubcategorySelectorProps> = ({
  selectedCategory,
  selectedSubcategory,
  onCategoryChange,
  onSubcategoryChange
}) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('category').select('*');
    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
  };

  const fetchSubcategories = async (categoryId: string) => {
    const { data, error } = await supabase
      .from('subcategory')
      .select('*')
      .eq('category_id', categoryId);
    if (error) {
      console.error('Error fetching subcategories:', error);
    } else {
      setSubcategories(data || []);
    }
  };

  return (
    <BlurView intensity={80} tint="dark" style={tw`rounded-xl p-4 mb-4`}>
      <Text style={tw`text-white text-lg mb-2`}>Category</Text>
      <View style={tw`bg-white/20 rounded-lg mb-4`}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={onCategoryChange}
          style={tw`text-white`}
        >
          {categories.map((category) => (
            <Picker.Item key={category.id} label={category.name} value={category.id} />
          ))}
        </Picker>
      </View>

      <Text style={tw`text-white text-lg mb-2`}>Subcategory</Text>
      <View style={tw`bg-white/20 rounded-lg`}>
        <Picker
          selectedValue={selectedSubcategory}
          onValueChange={onSubcategoryChange}
          style={tw`text-white`}
        >
          {subcategories.map((subcategory) => (
            <Picker.Item key={subcategory.id} label={subcategory.name} value={subcategory.id} />
          ))}
        </Picker>
      </View>
    </BlurView>
  );
};