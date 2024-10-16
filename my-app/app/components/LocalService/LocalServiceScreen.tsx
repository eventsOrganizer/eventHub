import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../services/supabaseClient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  LocalServiceDetails: { localServiceId: number };
};

type LocalServiceScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LocalServiceDetails'>;

interface ServiceItem {
  id: number;
  name: string;
  details: string;
  priceperhour: string;
  media: {
    url: string;
  }[];
}

const LocalServiceScreen: React.FC = () => {
  const navigation = useNavigation<LocalServiceScreenNavigationProp>();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('local')
        .select('id, name, details, priceperhour, media (url)')
        .order('id', { ascending: false }); // Ensure descending order
  
      if (error) {
        console.error('Error fetching services:', error);
      } else if (data) {
        setServices(data);
      }
    };
  
    fetchServices();
  
  }, []);
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (minPrice ? parseFloat(service.priceperhour) >= parseFloat(minPrice) : true) &&
    (maxPrice ? parseFloat(service.priceperhour) <= parseFloat(maxPrice) : true)
  );

  const renderServiceItem = ({ item }: { item: ServiceItem }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => {
        console.log('Navigating to LocalServiceDetails with id:', item.id);
        navigation.navigate('LocalServiceDetails', { localServiceId: item.id });
      }}
    >
      <Image source={{ uri: item.media[0]?.url }} style={styles.serviceImage} />
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.servicePrice}>${item.priceperhour}/hr</Text>
        <Text style={styles.serviceDetails}>{item.details}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search local services"
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
      <FlatList
        data={filteredServices}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
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
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  priceFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  priceInput: {
    width: '40%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  priceSeparator: {
    fontSize: 20,
  },
  list: {
    padding: 10,
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
});

export default LocalServiceScreen;