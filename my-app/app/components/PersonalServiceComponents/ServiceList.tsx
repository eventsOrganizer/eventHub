import React from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { Service } from '../../services/serviceTypes';
import { useNavigation } from '@react-navigation/native';
import { PersonalScreenNavigationProp } from '../../navigation/types';

interface ServiceListProps {
  services: Service[];
}

const ServiceList: React.FC<ServiceListProps> = ({ services }) => {
  const navigation = useNavigation<PersonalScreenNavigationProp>();

  const renderServiceItem = ({ item }: { item: Service }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => navigation.navigate('PersonalDetail', { personalId: item.id })}
    >
      <Image source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} style={styles.serviceImage} />
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.servicePrice}>${item.priceperhour}/hr</Text>
        <Text style={styles.serviceDetails} numberOfLines={2}>{item.details}</Text>
        <View style={styles.serviceStats}>
          <Text style={styles.serviceLikes}>❤️ {item.like?.length || 0}</Text>
          <Text style={styles.serviceReviews}>⭐ {item.review?.length || 0}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={services}
      renderItem={renderServiceItem}
      keyExtractor={(item) => item.id.toString()}
      style={styles.serviceList}
      contentContainerStyle={styles.serviceListContent}
      ListEmptyComponent={
        <Text style={styles.emptyListText}>No services found. Try adjusting your filters.</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  serviceList: {
    flex: 1,
  },
  serviceListContent: {
    padding: 10,
  },
  serviceItem: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  serviceInfo: {
    padding: 15,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  servicePrice: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 5,
  },
  serviceDetails: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 10,
  },
  serviceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceLikes: {
    fontSize: 14,
    color: '#E91E63',
  },
  serviceReviews: {
    fontSize: 14,
    color: '#FFC107',
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#757575',
  },
});

export default ServiceList;