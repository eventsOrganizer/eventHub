import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

interface NavBarProps {
  selectedFilter: string | null;
  setSelectedFilter: (value: string | null) => void;
  onSearch: (searchTerm: string) => void;
}
const NavBar: React.FC<NavBarProps> = ({ selectedFilter, setSelectedFilter, onSearch }) => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = () => {
    if (typeof onSearch === 'function') {
      onSearch(searchTerm);
    } else {
      console.error('onSearch is not a function');
    }
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#f0f0f0', '#e0e0e0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.navbar}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#0000FF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search events and services..."
            placeholderTextColor="#ccc"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSubmit}
          />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile' as never)}>
          <Ionicons name="person-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="notifications" size={24} color="#0000FF" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconContainer}
          onPress={() => navigation.navigate('ChatList' as never)}
        >
          <Ionicons name="chatbubbles-outline" size={24} color="#0000FF" />
        </TouchableOpacity>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={(value) => setSelectedFilter(value)}
            items={[
              { label: 'All', value: 'all' },
              { label: 'This Week', value: 'this_week' },
              { label: 'This Month', value: 'this_month' },
            ]}
            style={pickerSelectStyles}
            value={selectedFilter}
            Icon={() => <Ionicons name="chevron-down" size={20} color="#0000FF" />}
          />
        </View>
      </View>
    </LinearGradient>
  );
};



const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchBar: {
    flex: 1,
    color: '#000',
    fontSize: 16,
    paddingVertical: 8,
  },
  iconContainer: {
    marginHorizontal: 5,
    padding: 5,
  },
  pickerContainer: {
    width: 120,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: '#000',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#000',
    paddingRight: 30,
  },
});

export default NavBar;
