import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, TextInput, Dimensions } from 'react-native';
import { supabase } from '../services/supabaseClient';
import SubcategoryList from '../components/SubcategoryList';
import { Menu, Provider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

// Define your stack's parameter list
type RootStackParamList = {
  MaterialsScreen: undefined;
  MaterialDetail: { material: any }; // Define the expected parameters for MaterialDetail
};

// Define the navigation prop type for this screen
type MaterialsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MaterialsScreen'
>;
const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 20;
const MaterialsScreen = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation<MaterialsScreenNavigationProp>();
  useEffect(() => {
    const fetchMaterials = async () => {
      const { data, error } = await supabase
        .from('material')
        .select('id, name, price, price_per_hour, sell_or_rent, subcategory_id, media (url), details');

      if (error) {
        console.error('Error fetching materials:', error);
      } else {
        setMaterials(data || []);
      }
    };

    fetchMaterials();
  }, []);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  // Function to filter materials based on search query and price range
  const filteredMaterials = materials.filter(material => {
    const inPriceRange =
      (minPrice ? material.price >= parseFloat(minPrice) : true) &&
      (maxPrice ? material.price <= parseFloat(maxPrice) : true);
    
    return (
      inPriceRange &&
      (selectedSubcategory ? material.subcategory_id === selectedSubcategory : true) &&
      (searchQuery ? material.name.toLowerCase().includes(searchQuery.toLowerCase()) : true)
    );
  });

  const renderMaterialItem = ({ item, index }: { item: any; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100)}
      layout={Layout.springify()}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('MaterialDetail', { material: item })}
      >
        <Image source={{ uri: item.media[0]?.url }} style={styles.image} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />
        <View style={styles.cardContent}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.iconRow}>
            <Text style={styles.price}>
              {item.sell_or_rent === 'sell' ? `$${item.price}` : `$${item.price_per_hour}/hr`}
            </Text>
            <Ionicons
              name={item.sell_or_rent === 'sell' ? 'pricetag' : 'time'}
              size={20}
              color="#4CAF50"
            />
          </View>
          <View style={styles.iconRow}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="heart" size={20} color="#FF6B6B" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="chatbubble-ellipses" size={20} color="#4A90E2" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <Provider>
      <View style={styles.container}>
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
          <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#333" />
          </TouchableOpacity>
        </BlurView>

        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<View />}
          style={styles.menu}
        >
          <Menu.Item onPress={() => console.log('Update my services')} title="Update My Services" />
          <Menu.Item onPress={() => console.log('Create a material service')} title="Create a Material Service" />
          <Menu.Item onPress={() => console.log('Delete a material service')} title="Delete a Material Service" />
        </Menu>

        <View style={styles.filterContainer}>
          <TextInput
            style={styles.priceInput}
            placeholder="Min Price"
            keyboardType="numeric"
            value={minPrice}
            onChangeText={setMinPrice}
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.priceInput}
            placeholder="Max Price"
            keyboardType="numeric"
            value={maxPrice}
            onChangeText={setMaxPrice}
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.filterButton} onPress={() => console.log('Filter pressed')}>
            <Ionicons name="filter" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <SubcategoryList
          selectedSubcategory={selectedSubcategory}
          onSelectSubcategory={(subcategoryId) => setSelectedSubcategory(subcategoryId)}
        />

        <FlatList
          data={filteredMaterials}
          renderItem={renderMaterialItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
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
  menu: {
    marginTop: 50,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  priceInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 14,
    color: '#333',
  },
  filterButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  card: {
    width: CARD_WIDTH,
    height: 220,
    margin: 5,
    borderRadius: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 15,
    padding: 5,
  },
});

export default MaterialsScreen;
