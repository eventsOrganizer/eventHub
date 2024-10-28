import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service } from '../../services/serviceTypes';

// Ajoutez cette interface
interface ServiceWithLocation extends Service {
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface ServiceInfoProps {
  data: ServiceWithLocation;
  distance: number | null;
  address: string;
  onToggleMap: () => void;
  availability?: any; // Ajoutez le type approprié
  reviews?: any; // Ajoutez le type approprié
}

const ServiceInfo: React.FC<ServiceInfoProps> = ({
  data,
  distance,
  address,
  onToggleMap,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.name}</Text>
      
      <View style={styles.detailsContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {data.type === 'Material' 
              ? `${data.price}€` 
              : `${data.priceperhour}€/heure`}
          </Text>
        </View>

        <TouchableOpacity style={styles.locationContainer} onPress={onToggleMap}>
          <Ionicons name="location-outline" size={20} color="#FFF" />
          <Text style={styles.locationText}>
            {distance ? `${distance.toFixed(1)} km` : 'Distance N/A'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.address}>{address}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 8,
  },
  price: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 8,
  },
  locationText: {
    color: '#FFF',
    marginLeft: 5,
  },
  address: {
    color: '#FFF',
    fontSize: 14,
    opacity: 0.8,
  },
});

export default ServiceInfo;
