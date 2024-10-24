import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import tw from 'twrnc';

interface NavBarProps {
  selectedFilter: string | null;
  setSelectedFilter: (value: string | null) => void;
  onSearch: (searchTerm: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ selectedFilter, setSelectedFilter, onSearch }) => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const { width } = Dimensions.get('window');

  const createCurve = () => {
    const height = 20;
    return `M0,${height} C${width / 4},0 ${width * 3 / 4},0 ${width},${height} L${width},0 L0,0 Z`;
  };

  return (
    <View style={tw`relative`}>
      <LinearGradient
        colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)', 'transparent']}
        style={tw`pt-4 px-3 pb-8`}
      >
        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-1 flex-row items-center bg-white bg-opacity-20 rounded-full px-3 py-2 mr-2`}>
            <Ionicons name="search" size={20} color="#1a2a4a" style={tw`mr-2`} />
            <TextInput
              style={tw`flex-1 text-[#1a2a4a] text-base`}
              placeholder="Search events and services..."
              placeholderTextColor="#4a5a7a"
              value={searchTerm}
              onChangeText={setSearchTerm}
              onSubmitEditing={() => onSearch(searchTerm)}
            />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('UserProfile' as never)} style={tw`p-2`}>
            <Ionicons name="person-outline" size={24} color="#1a2a4a" />
          </TouchableOpacity>
          <TouchableOpacity style={tw`p-2`}>
            <Ionicons name="notifications" size={24} color="#1a2a4a" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={tw`p-2`}
            onPress={() => navigation.navigate('ChatList' as never)}
          >
            <Ionicons name="chatbubbles-outline" size={24} color="#1a2a4a" />
          </TouchableOpacity>
          <View style={tw`w-30`}>
            <RNPickerSelect
              onValueChange={(value) => setSelectedFilter(value)}
              items={[
                { label: 'All', value: 'all' },
                { label: 'This Week', value: 'this_week' },
                { label: 'This Month', value: 'this_month' },
              ]}
              style={{
                inputIOS: tw`text-[#1a2a4a] text-base pr-8`,
                inputAndroid: tw`text-[#1a2a4a] text-base pr-8`,
              }}
              value={selectedFilter}
              Icon={() => <Ionicons name="chevron-down" size={20} color="#1a2a4a" style={tw`absolute right-0 top-2`} />}
            />
          </View>
        </View>
      </LinearGradient>
      <Svg height="20" width={width} style={tw`absolute bottom-0`}>
        <Path d={createCurve()} fill="rgba(255,255,255,0.8)" />
      </Svg>
    </View>
  );
};

export default NavBar;











/////////////////



import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import tw from 'twrnc';

interface NavBarProps {
  selectedFilter: string | null;
  setSelectedFilter: (value: string | null) => void;
  onSearch: (searchTerm: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ selectedFilter, setSelectedFilter, onSearch }) => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <LinearGradient
      colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)', 'transparent']}
      style={tw`py-4 px-3 rounded-b-lg`}
    >
      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`flex-1 flex-row items-center bg-white bg-opacity-20 rounded-full px-3 py-2 mr-2`}>
          <Ionicons name="search" size={20} color="#1a2a4a" style={tw`mr-2`} />
          <TextInput
            style={tw`flex-1 text-[#1a2a4a] text-base`}
            placeholder="Search events and services..."
            placeholderTextColor="#4a5a7a"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={() => onSearch(searchTerm)}
          />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile' as never)} style={tw`p-2`}>
          <Ionicons name="person-outline" size={24} color="#1a2a4a" />
        </TouchableOpacity>
        <TouchableOpacity style={tw`p-2`}>
          <Ionicons name="notifications" size={24} color="#1a2a4a" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={tw`p-2`}
          onPress={() => navigation.navigate('ChatList' as never)}
        >
          <Ionicons name="chatbubbles-outline" size={24} color="#1a2a4a" />
        </TouchableOpacity>
        <View style={tw`w-30`}>
          <RNPickerSelect
            onValueChange={(value) => setSelectedFilter(value)}
            items={[
              { label: 'All', value: 'all' },
              { label: 'This Week', value: 'this_week' },
              { label: 'This Month', value: 'this_month' },
            ]}
            style={{
              inputIOS: tw`text-[#1a2a4a] text-base pr-8`,
              inputAndroid: tw`text-[#1a2a4a] text-base pr-8`,
            }}
            value={selectedFilter}
            Icon={() => <Ionicons name="chevron-down" size={20} color="#1a2a4a" style={tw`absolute right-0 top-2`} />}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

export default NavBar;





//////////////


import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../services/supabaseClient';
import tw from 'twrnc';

interface FilterAdvancedProps {
  onEventsLoaded: (events: any[]) => void;
}

const FilterAdvanced: React.FC<FilterAdvancedProps> = ({ onEventsLoaded }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchFilteredEvents();
  }, [selectedCategory, selectedSubcategory]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('category')
      .select('id, name')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return;
    }

    setCategories([{ id: null, name: 'All' }, ...data]);
  };

  const fetchSubcategories = async (categoryId: number) => {
    const { data, error } = await supabase
      .from('subcategory')
      .select('id, name')
      .eq('category_id', categoryId)
      .order('name');

    if (error) {
      console.error('Error fetching subcategories:', error);
      return;
    }

    setSubcategories([{ id: null, name: 'All' }, ...data]);
  };

  const fetchFilteredEvents = async () => {
    let query = supabase
      .from('event')
      .select(`
        *,
        subcategory!inner (id, name, category_id),
        location!inner (id, longitude, latitude),
        availability!inner (id, start, end, daysofweek, date),
        media (url),
        user:user_id (email),
        event_has_user!inner (user_id)
      `);

    if (selectedCategory) {
      query = query.eq('subcategory.category_id', selectedCategory);
    }

    if (selectedSubcategory) {
      query = query.eq('subcategory_id', selectedSubcategory);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching filtered events:', error);
      return;
    }

    onEventsLoaded(data || []);
  };

  return (
    <View style={tw`p-4 bg-white`}>
      <Text style={tw`text-lg font-bold mb-2`}>Filter Events</Text>
      <View style={tw`mb-4`}>
        <Text style={tw`mb-1`}>Category</Text>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => {
            setSelectedCategory(itemValue);
            setSelectedSubcategory(null);
          }}
          style={tw`border border-gray-300 rounded`}
        >
          {categories.map((category) => (
            <Picker.Item key={category.id} label={category.name} value={category.id} />
          ))}
        </Picker>
      </View>
      {selectedCategory !== null && (
        <View style={tw`mb-4`}>
          <Text style={tw`mb-1`}>Subcategory</Text>
          <Picker
            selectedValue={selectedSubcategory}
            onValueChange={(itemValue) => setSelectedSubcategory(itemValue)}
            style={tw`border border-gray-300 rounded`}
          >
            {subcategories.map((subcategory) => (
              <Picker.Item key={subcategory.id} label={subcategory.name} value={subcategory.id} />
            ))}
          </Picker>
        </View>
      )}
    </View>
  );
};

export default FilterAdvanced;







