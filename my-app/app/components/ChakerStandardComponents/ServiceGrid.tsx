import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service } from '../../services/personalService';
import { PersonalScreenNavigationProp } from '../../navigation/types';

type ServiceGridProps = {
  services: Service[];
  navigation: PersonalScreenNavigationProp;
};

const ServiceGrid: React.FC<ServiceGridProps> = ({ services, navigation }) => {
  return (
    <ScrollView style={styles.servicesGrid}>
      <View style={styles.grid}>
        {services.map(service => (
          <TouchableOpacity
            key={service.id}
            style={styles.serviceItem}
            onPress={() => navigation.navigate('PersonalDetail', { personalId: service.id })} 
          >
            <Image source={{ uri: service.imageUrl }} style={styles.serviceImage} />
            <Ionicons name="heart-outline" size={24} color="black" style={styles.favoriteIcon} />
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.servicePrice}>${service.priceperhour}/hr</Text>
            {service.subcategory && (
              <Text style={styles.serviceSubcategory}>{service.subcategory.name}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  servicesGrid: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  serviceItem: {
    width: '48%',
    marginBottom: 20,
  },
  serviceImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  serviceName: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  servicePrice: {
    fontSize: 14,
    color: 'green',
  },
  serviceSubcategory: {
    fontSize: 12,
    color: 'gray',
  },
});

export default ServiceGrid;