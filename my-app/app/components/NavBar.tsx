import React, { useState } from 'react'; 
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import tw from 'twrnc';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  SearchResultsScreen: { searchTerm: string };
  // ... other screens
};


interface NavBarProps {
  selectedFilter: string | null;
  setSelectedFilter: (value: string | null) => void;
  onSearch: (searchTerm: string) => void;
}


const NavBar: React.FC<NavBarProps> = ({ selectedFilter, setSelectedFilter, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');


  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const handleSearch = () => {
   // ... existing code ...
  if (searchTerm.trim()) {
    navigation.navigate('SearchResultsScreen', { searchTerm: searchTerm.trim() });
    setSearchTerm('');
  }
  };

  return (
    <BlurView intensity={80} tint="dark" style={tw`py-4 px-3`}>
      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`flex-1 flex-row items-center bg-white bg-opacity-20 rounded-full px-3 py-2 mr-2`}>
          <Ionicons name="search" size={20} color="#fff" style={tw`mr-2`} />
          <TextInput
      placeholder="Search..."
      value={searchTerm}
      onChangeText={setSearchTerm}
      onSubmitEditing={handleSearch} // Ensure this triggers handleSearch
      style={styles.searchBar}
    />
          {searchTerm ? ( // Clear button
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <Ionicons name="close-circle" size={20} color="#0000FF" />
            </TouchableOpacity>
          ) : null}
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
            onValueChange={setSelectedFilter}
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