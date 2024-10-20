import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Provider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { supabase } from '../../../lib/supabase';
import { Material } from '../../navigation/types';
import Header from '../../components/MaterialService/Header';
import FilterSection from '../../components/MaterialService/FilterSection';
import MaterialList from '../../components/MaterialService/MaterialList';
    import { RootStackParamList } from '../../navigation/types';
    import { Button } from 'react-native-paper'; 

    type MaterialsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MaterialScreen'>;

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
      .select('id, name, price, price_per_hour, sell_or_rent, subcategory_id, media (url), details');

    if (error) {
      console.error('Error fetching materials:', error);
    } else {
      setMaterials(data?.map((item: Material) => ({
        ...item,
        subcategory: item.subcategory_id // Map subcategory_id to subcategory for compatibility
      })) || []);
    }
  };

  const addToBasket = (material: Material) => {
    setBasket([...basket, material]);
  };

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

  const navigateToBasket = () => {
    navigation.navigate('Basket', { basket });
  };
  const navigateToOnboarding = () => {
    navigation.navigate('MaterialsOnboarding');
  };
  return (
    <Provider>
      <View style={styles.container}>
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          basketCount={basket.length}
          onBasketPress={navigateToBasket}
         
        />
        <Button onPress={navigateToOnboarding} mode="contained">
        Add New Material
      </Button>
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