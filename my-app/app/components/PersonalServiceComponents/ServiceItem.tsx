import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Service } from '../../services/serviceTypes';
import { RootStackParamList } from '../../navigation/types';

interface ServiceItemProps {
  service: Service;
}

type ServiceItemNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PersonalDetail'>;

const ServiceItem: React.FC<ServiceItemProps> = ({ service }) => {
  const navigation = useNavigation<ServiceItemNavigationProp>();

  const handlePress = () => {
    navigation.navigate('PersonalDetail', { personalId: service.id });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image source={{ uri: service.imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.price}>${service.priceperhour}/hr</Text>
        <Text style={styles.category}>{service.subcategory?.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: 'green',
    marginTop: 4,
  },
  category: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
});

export default ServiceItem;