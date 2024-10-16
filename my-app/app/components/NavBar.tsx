import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

interface NavBarProps {
  selectedFilter: string | null;
  setSelectedFilter: (value: string | null) => void;
}

const NavBar: React.FC<NavBarProps> = ({ selectedFilter, setSelectedFilter }) => {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={['white', 'orange']}  // Updated gradient from white to orange
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}  // Vertical gradient from top to bottom
      style={styles.container}
    >
      <View style={styles.navbar}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#fff" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search events..."
            placeholderTextColor="#ccc"
          />
        </View>
        <TouchableOpacity 
          style={styles.iconContainer}
          onPress={() => navigation.navigate('UserProfile' as never)}
        >
          <Ionicons name="person" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="notifications" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconContainer}
          onPress={() => navigation.navigate('ChatList' as never)}
        >
          <Ionicons name="chatbubbles-outline" size={24} color="#fff" />
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
            Icon={() => <Ionicons name="chevron-down" size={20} color="#fff" />}
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchBar: {
    flex: 1,
    color: '#fff',
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
    color: 'white',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'white',
    paddingRight: 30,
  },
});

export default NavBar;
