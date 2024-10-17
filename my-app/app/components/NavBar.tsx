import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
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
    <BlurView intensity={80} tint="dark" style={tw`py-4 px-3`}>
      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`flex-1 flex-row items-center bg-white bg-opacity-20 rounded-full px-3 py-2 mr-2`}>
          <Ionicons name="search" size={20} color="#fff" style={tw`mr-2`} />
          <TextInput
            style={tw`flex-1 text-white text-base`}
            placeholder="Search events and services..."
            placeholderTextColor="#ccc"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={() => onSearch(searchTerm)}
          />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile' as never)} style={tw`p-2`}>
          <Ionicons name="person-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={tw`p-2`}>
          <Ionicons name="notifications" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={tw`p-2`}
          onPress={() => navigation.navigate('ChatList' as never)}
        >
          <Ionicons name="chatbubbles-outline" size={24} color="#fff" />
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
              inputIOS: tw`text-white text-base pr-8`,
              inputAndroid: tw`text-white text-base pr-8`,
            }}
            value={selectedFilter}
            Icon={() => <Ionicons name="chevron-down" size={20} color="#fff" style={tw`absolute right-0 top-2`} />}
          />
        </View>
      </View>
    </BlurView>
  );
};

export default NavBar;