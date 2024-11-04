import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text } from 'react-native';
import { Provider, FAB } from 'react-native-paper';
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
import { useBasket } from '../../components/basket/BasketContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, Layout, useSharedValue, interpolate, useAnimatedScrollHandler, useAnimatedStyle } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../../../lib/theme';
type MaterialsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MaterialScreen'>;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// Add these imports


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
  const { basketItems, addToBasket } = useBasket();

  const scrollY = useSharedValue(0);

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

  const addToBasketHandler = (material: Material) => {
    addToBasket(material);
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

  const filteredMaterials = useMemo(() => {
    return materials.filter(material => {
      const inPriceRange =
        (minPrice ? material.price >= parseFloat(minPrice) : true) &&
        (maxPrice ? material.price <= parseFloat(maxPrice) : true);
      
      return (
        inPriceRange &&
        (searchQuery ? material.name.toLowerCase().includes(searchQuery.toLowerCase()) : true)
      );
    });
  }, [materials, minPrice, maxPrice, searchQuery]);

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

  const renderMaterialCard = useCallback(({ item, index }: { item: Material; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100)}
      layout={Layout.springify()}
    >
      <MaterialCard
        material={item}
        onAddToBasket={addToBasketHandler}
        onToggleWishlist={toggleWishlist}
        isWishlisted={wishlist.includes(item.id)}
        onPress={() => navigation.navigate('MaterialDetail', { material: item })}
      />
    </Animated.View>
  ), [wishlist, navigation, addToBasketHandler, toggleWishlist]);

  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <Provider>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <LinearGradient
          colors={[theme.colors.gradientStart, theme.colors.gradientMiddle, theme.colors.gradientEnd]}
          style={StyleSheet.absoluteFill}
        />
        
        <Animated.View 
          entering={FadeInDown}
          style={[styles.headerContainer]}
        >
          <AnimatedHeader 
            scrollY={scrollY}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            basketCount={basketItems.length}
            onBasketPress={navigateToBasket}
            selectedSubcategory={selectedSubcategory}
            onSelectSubcategory={setSelectedSubcategory}
            minPrice={minPrice}
            maxPrice={maxPrice}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
          />
        </Animated.View>

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
              tintColor={theme.colors.accent}
              colors={[theme.colors.accent]}
            />
          }
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons 
                name="package-variant" 
                size={48} 
                color={theme.colors.secondary} 
              />
              <Text style={styles.emptyText}>No materials found</Text>
            </View>
          )}
          layoutAnimation={Layout.springify()}
        />

        <FAB
          style={styles.fab}
          icon="plus"
          color={theme.colors.primary}
          onPress={navigateToOnboarding}
          animated
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
  headerContainer: {
    zIndex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 16,
    color: theme.colors.secondary,
  },
  separator: {
    height: 8,
  },
});

export default MaterialsScreen;
