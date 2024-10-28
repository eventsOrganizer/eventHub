import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Service } from '../services/serviceTypes';

type RootStackParamList = {
  ServicesDetails: {
    serviceId: number;
    serviceType: 'Personal' | 'Local' | 'Material';
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ServiceCardProps {
  item: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ item }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate('ServicesDetails', {
      serviceId: item.id,
      serviceType: item.type as 'Personal' | 'Local' | 'Material'
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image 
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>
          {item.type === 'Material' 
            ? `${item.price}€` 
            : `${item.priceperhour}€/heure`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: '#666',
  },
});

export default ServiceCard;
