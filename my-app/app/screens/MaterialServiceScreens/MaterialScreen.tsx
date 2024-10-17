import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Provider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { supabase } from '../../services/supabaseClient';
import { Material } from '../../navigation/types';
import Header from '../../components/MaterialService/Header';
import FilterSection from '../../components/MaterialService/FilterSection';
import MaterialList from '../../components/MaterialService/MaterialList';
import { RootStackParamList } from '../../navigation/types';

type MaterialsScreenNavigationProp = StackNavigationProp<RootStackParamList, keyof RootStackParamList>;

const MaterialsScreen = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [basket, setBasket] = useState<Material[]>([]);
  const navigation = useNavigation<MaterialsScreenNavigationProp>();

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    const { data, error } = await supabase
      .from('material')
      .select('id, name, price, price_per_hour, sell_or_rent, subcategory, media (url), details');

    if (error) {
      console.error('Error fetching materials:', error);
    } else {
      setMaterials(data ? data.map(material => ({
        ...material,
        subcategory: material.subcategory,
      })) : []);
    }
  };

  const addToBasket = (material: Material) => {
    if (material.sell_or_rent === 'sell') {
      setBasket([...basket, material]);
    } else {
      // For rent items, we'll implement the request logic in the BasketScreen
      setBasket([...basket, material]);
    }
  };

  const filteredMaterials = materials.filter(material => {
    const inPriceRange =
      (minPrice ? material.price >= parseFloat(minPrice) : true) &&
      (maxPrice ? material.price <= parseFloat(maxPrice) : true);
    
    return (
      inPriceRange &&
      (selectedSubcategory ? material.subcategory === String(selectedSubcategory) : true) &&
      (searchQuery ? material.name.toLowerCase().includes(searchQuery.toLowerCase()) : true)
    );
  });

  const navigateToBasket = () => {
    navigation.navigate('Basket', { basket });
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          basketCount={basket.length}
          onBasketPress={navigateToBasket}
          navigation={navigation}
        />
        <FilterSection
          minPrice={minPrice}
          maxPrice={maxPrice}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          selectedSubcategory={selectedSubcategory}
          setSelectedSubcategory={setSelectedSubcategory}
        />
        <MaterialList
          materials={filteredMaterials}
          addToBasket={addToBasket}
          navigation={navigation}
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
});

export default MaterialsScreen;