import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PersonalScreenNavigationProp } from '../../navigation/types';
import { fetchStaffServices, Service } from '../../services/personalService';
import CategoryList from '../../components/ChakerStandardComponents/CategoryList';

const PersonalsScreen = () => {
  const [staffServices, setStaffServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const navigation = useNavigation<PersonalScreenNavigationProp>();
  const route = useRoute();
  const { category }: { category?: string } = route.params || {};

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  useEffect(() => {
    const loadServices = async () => {
      const services = await fetchStaffServices();
      setStaffServices(services);
    };
    loadServices();
  }, []);

  const filteredServices = staffServices
    .filter(service => 
      (selectedCategory ? service.subcategory?.name === selectedCategory : true) &&
      (searchQuery ? service.name.toLowerCase().includes(searchQuery.toLowerCase()) : true) &&
      (minPrice ? service.priceperhour >= parseFloat(minPrice) : true) &&
      (maxPrice ? service.priceperhour <= parseFloat(maxPrice) : true)
    );

  const renderServiceItem = ({ item }: { item: Service }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => navigation.navigate('PersonalDetail', { personalId: item.id })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.serviceImage} />
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.servicePrice}>${item.priceperhour}/hr</Text>
        <Text style={styles.serviceDetails}>{item.details}</Text>
        <Text style={styles.serviceLikes}>Likes: {item.likes?.length || 0}</Text>
        <Text style={styles.serviceReviews}>Reviews: {item.review?.length || 0}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search staff services"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <View style={styles.priceFilter}>
        <TextInput
          style={styles.priceInput}
          placeholder="Min price"
          value={minPrice}
          onChangeText={setMinPrice}
          keyboardType="numeric"
        />
        <Text style={styles.priceSeparator}>-</Text>
        <TextInput
          style={styles.priceInput}
          placeholder="Max price"
          value={maxPrice}
          onChangeText={setMaxPrice}
          keyboardType="numeric"
        />
      </View>
      <CategoryList selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      <FlatList
        data={filteredServices}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.serviceList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    margin: 10,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  searchInput: {
    paddingVertical: 8,
    color: 'black',
  },
  priceFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  priceSeparator: {
    marginHorizontal: 10,
  },
  serviceList: {
    flex: 1,
  },
  serviceItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 10,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  servicePrice: {
    fontSize: 16,
    color: 'green',
  },
  serviceDetails: {
    fontSize: 14,
    color: 'gray',
  },
  serviceLikes: {
    fontSize: 14,
    color: 'blue',
  },
  serviceReviews: {
    fontSize: 14,
    color: 'orange',
  },
});

export default PersonalsScreen;