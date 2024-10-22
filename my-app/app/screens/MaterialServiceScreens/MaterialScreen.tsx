import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TextInput, Text } from 'react-native';
import { Provider, FAB, Snackbar, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../lib/supabase';
import { Material, RootStackParamList } from '../../navigation/types';
import Header from '../../components/MaterialService/Header';
import MaterialCard from '../../components/MaterialService/MaterialCard';
import SubcategoryList from '../../components/MaterialService/SubcategoryList';
import { useToast } from "../../hooks/use-toast";

type MaterialsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MaterialScreen'>;

const MaterialsScreen = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [basket, setBasket] = useState<Material[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigation = useNavigation<MaterialsScreenNavigationProp>();
  const { toast } = useToast();

  useEffect(() => {
    fetchMaterials();
  }, [selectedSubcategory]);

  const fetchMaterials = async () => {
    setRefreshing(true);
    let query = supabase
      .from('material')
      .select('id, name, price, price_per_hour, sell_or_rent, subcategory_id, media (url), details');

    if (selectedSubcategory === 'rent') {
      query = query.eq('sell_or_rent', 'rent');
    } else if (selectedSubcategory === 'sell') {
      query = query.eq('sell_or_rent', 'sell');
    } else if (selectedSubcategory !== null) {
      query = query.eq('subcategory_id', selectedSubcategory);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching materials:', error);
      showSnackbar('Failed to fetch materials');
    } else {
      setMaterials(data?.map((item: Material) => ({
        ...item,
        subcategory: item.subcategory_id,
        media: item.media || []
      })) || []);
    }
    setRefreshing(false);
  };

  const addToBasket = (material: Material) => {
    setBasket([...basket, material]);
    showSnackbar(`${material.name} added to basket`);
  };

  const toggleWishlist = (materialId: string) => {
    setWishlist(prev => 
      prev.includes(materialId) 
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
    showSnackbar(wishlist.includes(materialId) ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const filteredMaterials = materials.filter(material => {
    const inPriceRange =
      (minPrice ? material.price >= parseFloat(minPrice) : true) &&
      (maxPrice ? material.price <= parseFloat(maxPrice) : true);
    
    return (
      inPriceRange &&
      (searchQuery ? material.name.toLowerCase().includes(searchQuery.toLowerCase()) : true)
    );
  });

  const navigateToBasket = () => {
    navigation.navigate('Basket', { basket });
  };

  const navigateToOnboarding = () => {
    navigation.navigate('MaterialsOnboarding');
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const renderMaterialCard = ({ item }: { item: Material }) => (
    <MaterialCard
      material={item}
      onAddToBasket={addToBasket}
      onToggleWishlist={toggleWishlist}
      isWishlisted={wishlist.includes(item.id)}
      onPress={() => navigation.navigate('MaterialDetail', { material: item })}
    />
  );

  return (
    <Provider>
      <LinearGradient
        colors={['#F0F4F8', '#E1E8ED', '#D2DCE5', '#C3D0D9']}
        style={styles.container}
      >
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          basketCount={basket.length}
          onBasketPress={navigateToBasket}
        />
        <SubcategoryList
          selectedSubcategory={selectedSubcategory}
          onSelectSubcategory={setSelectedSubcategory}
        />
        <View style={styles.priceFilterContainer}>
          <Text style={styles.filterLabel}>Price Range:</Text>
          <View style={styles.priceInputContainer}>
            <TextInput
              style={styles.priceInput}
              placeholder="Min"
              value={minPrice}
              onChangeText={setMinPrice}
              keyboardType="numeric"
            />
            <Text style={styles.priceSeparator}>-</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="Max"
              value={maxPrice}
              onChangeText={setMaxPrice}
              keyboardType="numeric"
            />
          </View>
          <Button 
            mode="contained" 
            onPress={() => {/* Apply filter logic */}} 
            style={styles.filterButton}
          >
            Apply
          </Button>
        </View>
        <FlatList
          data={filteredMaterials}
          renderItem={renderMaterialCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchMaterials} />
          }
        />
        <FAB
          style={styles.fab}
          icon={({ size, color }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          )}
          onPress={navigateToOnboarding}
          label="Add New"
        />
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={styles.snackbar}
        >
          {snackbarMessage}
        </Snackbar>
      </LinearGradient>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  priceFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 10,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    width: 80,
    height: 40,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    color: '#333',
  },
  priceSeparator: {
    marginHorizontal: 10,
    fontSize: 18,
    color: '#333',
  },
  filterButton: {
    backgroundColor: '#4A90E2',
  },
  listContainer: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4A90E2',
  },
  snackbar: {
    backgroundColor: '#333',
  },
});

export default MaterialsScreen;