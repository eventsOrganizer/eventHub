import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../../../services/supabaseClient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface Service {
  id: number;
  name: string;
  type: string;
}

const categories = [
  { name: 'All', icon: 'apps-outline' },
  { name: 'Personal', icon: 'person-outline' },
  { name: 'Local', icon: 'home-outline' },
  { name: 'Material', icon: 'construct-outline' }
];

const UserServicesList: React.FC<{ userId: string }> = ({ userId }) => {
  const [userServices, setUserServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserServices();
  }, [userId]);

  const fetchUserServices = async () => {
    const { data: personalData, error: personalError } = await supabase
      .from('personal')
      .select('id, name')
      .eq('user_id', userId);

    const { data: localData, error: localError } = await supabase
      .from('local')
      .select('id, name')
      .eq('user_id', userId);

    const { data: materialData, error: materialError } = await supabase
      .from('material')
      .select('id, name')
      .eq('user_id', userId);

    if (personalError || localError || materialError) {
      console.error('Error fetching user services:', personalError || localError || materialError);
    } else {
      const allServices = [
        ...(personalData || []).map(s => ({ ...s, type: 'Personal' })),
        ...(localData || []).map(s => ({ ...s, type: 'Local' })),
        ...(materialData || []).map(s => ({ ...s, type: 'Material' }))
      ];
      setUserServices(allServices);
    }
  };

  const filteredServices = selectedCategory === 'All'
    ? userServices
    : userServices.filter(service => service.type === selectedCategory);

  const handleServicePress = (service: Service) => {
    if (service.type === 'Personal') {
      navigation.navigate('PersonalDetail', { personalId: service.id });
    } else if (service.type === 'Local') {
      navigation.navigate('LocalServiceDetails', { localServiceId: service.id });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Services</Text>
      <View style={styles.categoryContainer}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.name}
            style={[
              styles.categoryButton,
              selectedCategory === category.name && styles.selectedCategoryButton
            ]}
            onPress={() => setSelectedCategory(category.name)}
          >
            <Ionicons name={category.icon} size={20} color={selectedCategory === category.name ? 'white' : 'black'} />
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredServices}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.serviceItem} onPress={() => handleServicePress(item)}>
            <Ionicons
              name={item.type === 'Personal' ? 'person' : item.type === 'Local' ? 'home' : 'construct'}
              size={24}
              color="#666"
            />
            <View style={styles.serviceTextContainer}>
              <Text style={styles.serviceName}>{item.name}</Text>
              <Text style={styles.serviceType}>{item.type}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => `${item.type}-${item.id}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#eee',
    marginHorizontal: 5,
  },
  selectedCategoryButton: {
    backgroundColor: '#ddd',
  },
  categoryText: {
    fontSize: 14,
    marginLeft: 5,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  serviceTextContainer: {
    marginLeft: 10,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  serviceType: {
    fontSize: 14,
    color: '#666',
  },
});

export default UserServicesList;
