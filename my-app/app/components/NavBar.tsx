import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';

interface NavBarProps {
  selectedFilter: string | null;
  setSelectedFilter: (value: string | null) => void;
}

const NavBar: React.FC<NavBarProps> = ({ selectedFilter, setSelectedFilter }) => {
  return (
    <View style={styles.navbar}>
      <TextInput
        style={styles.searchBar}
        placeholder="Rechercher des événements..."
      />
      <Ionicons name="notifications-outline" size={24} style={styles.icon} />
      <RNPickerSelect
        onValueChange={(value) => setSelectedFilter(value)}
        items={[
          { label: 'Tous', value: 'all' },
          { label: 'Événements', value: 'events' },
          { label: 'Produits', value: 'products' },
          { label: 'Services', value: 'services' },
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: "Filtre Avancé", value: null }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  icon: {
    marginHorizontal: 5,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
});

export default NavBar;