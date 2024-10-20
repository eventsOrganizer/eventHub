import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import BasketIcon from './BasketIcon';
import { Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';

type HeaderNavigationProp = StackNavigationProp<RootStackParamList, 'MaterialScreen'>;

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  basketCount: number;
  onBasketPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  basketCount, 
  onBasketPress
}) => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const navigation = useNavigation<HeaderNavigationProp>();

  return (
    <BlurView intensity={100} style={styles.header}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>
      <BasketIcon count={basketCount} onPress={onBasketPress} />
      <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
        <Ionicons name="ellipsis-vertical" size={24} color="#333" />
      </TouchableOpacity>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={<View />}
      >
        <Menu.Item onPress={() => {
          setMenuVisible(false);
          navigation.navigate('MaterialsOnboarding');
        }} title="Create a Material Service" />
        <Menu.Item onPress={() => {
          setMenuVisible(false);
          console.log('Update my services');
        }} title="Update My Services" />
        <Menu.Item onPress={() => {
          setMenuVisible(false);
          console.log('Delete a material service');
        }} title="Delete a Material Service" />
      </Menu>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  menuButton: {
    padding: 10,
  },
});

export default Header;