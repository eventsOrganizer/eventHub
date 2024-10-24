import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Animated } from 'react-native';
import { Provider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../../lib/supabase';
import { Material, RootStackParamList } from '../../navigation/types';
import MaterialCard from '../../components/MaterialService/MaterialCard';
import { AnimatedHeader } from '../../components/MaterialService/AnimatedHeader';
import { BottomActions } from '../../components/MaterialService/BottomActions';
import { useToast } from "../../hooks/use-toast";
import { themeColors } from '../../utils/themeColors';

type MaterialsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MaterialScreen'>;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

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

  const scrollY = new Animated.Value(0);
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

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

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  return (
    <Provider>
      <View style={styles.container}>
        <LinearGradient
          colors={themeColors.rent.background}
          style={StyleSheet.absoluteFill}
        />
        <AnimatedHeader 
          headerOpacity={headerOpacity}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          basketCount={basket.length}
          onBasketPress={navigateToBasket}
          selectedSubcategory={selectedSubcategory}
          onSelectSubcategory={setSelectedSubcategory}
          minPrice={minPrice}
          maxPrice={maxPrice}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
        />
        <AnimatedFlatList
          data={filteredMaterials}
          renderItem={renderMaterialCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={fetchMaterials}
              tintColor={themeColors.rent.primary}
              colors={[themeColors.rent.primary]}
            />
          }
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        />
        <BottomActions 
          onAddNew={navigateToOnboarding}
          snackbarVisible={snackbarVisible}
          snackbarMessage={snackbarMessage}
          onDismissSnackbar={() => setSnackbarVisible(false)}
        />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 8,
    paddingBottom: 80,
  },
});

export default MaterialsScreen;
