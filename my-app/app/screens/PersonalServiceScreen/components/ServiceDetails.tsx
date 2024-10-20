import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Service } from '../../../services/serviceTypes';

interface ServiceDetailsProps {
  personalData: Service;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ personalData }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Details</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Category: {personalData.subcategory?.name}</Text>
        <Text style={styles.detailText}>Price: {personalData.priceperhour}€/hour</Text>
        <Text style={styles.detailText}>Description: {personalData.details}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  detailsContainer: {
    gap: 8,
  },
  detailText: {
    color: '#4B5563', // Equivalent to Tailwind's text-gray-600
  },
});

export default ServiceDetails;