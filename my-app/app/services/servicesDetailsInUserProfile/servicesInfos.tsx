import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Service } from '../../services/serviceTypes';

interface ServiceWithLocation extends Service {
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface ServiceInfoProps {
  data: ServiceWithLocation;
  availability?: any;
  reviews?: any;
}

const ServiceInfo: React.FC<ServiceInfoProps> = ({
  data,
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

        <View style={styles.percentageContainer}>
          <Text style={styles.percentageText}>
          Deposit: {data.percentage || 25}%
          </Text>
        </View>
      </View>
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
  percentageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 8,
  },
  percentageText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ServiceInfo;