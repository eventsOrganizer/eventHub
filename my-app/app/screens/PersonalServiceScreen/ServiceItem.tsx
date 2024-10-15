import React from 'react';
import { TouchableOpacity, Image, View, Text } from 'react-native';
import { Service } from '../../services/serviceTypes';
import { styles } from './styles';

interface ServiceItemProps {
  item: Service;
  onPress: (id: number) => void;
}

export const ServiceItem: React.FC<ServiceItemProps> = ({ item, onPress }) => (
  <TouchableOpacity
    style={styles.serviceItem}
    onPress={() => onPress(item.id)}
  >
    <Image source={{ uri: item.imageUrl }} style={styles.serviceImage} />
    <View style={styles.serviceInfo}>
      <Text style={styles.serviceName}>{item.name}</Text>
      <Text style={styles.servicePrice}>${item.priceperhour}/hr</Text>
      <Text style={styles.serviceDetails}>{item.details}</Text>
      <View style={styles.serviceStats}>
        <Text style={styles.serviceLikes}>❤️ {item.like?.length || 0}</Text>
        <Text style={styles.serviceReviews}>⭐ {item.review?.length || 0}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default ServiceItem;