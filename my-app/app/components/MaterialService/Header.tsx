import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { ShoppingBasket } from 'lucide-react-native';

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
    <BlurView intensity={80} tint="light" style={styles.header}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#4A90E2" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search materials..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>
      <TouchableOpacity onPress={onBasketPress} style={styles.basketButton}>
        <ShoppingBasket size={24} color="#4A90E2" />
        {basketCount > 0 && (
          <View style={styles.basketBadge}>
            <Text style={styles.basketBadgeText}>{basketCount}</Text>
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
        <Ionicons name="ellipsis-vertical" size={24} color="#4A90E2" />
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
  basketButton: {
    position: 'relative',
    padding: 10,
  },
  basketBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  basketBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 10,
  },
});

export default Header;
