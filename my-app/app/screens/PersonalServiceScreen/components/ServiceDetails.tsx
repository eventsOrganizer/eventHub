import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Service } from '../../../services/serviceTypes';
import { Ionicons } from '@expo/vector-icons';

interface ServiceDetailsProps {
  personalData: Service;
  onReviewPress: () => void;
  onCommentPress: () => void;
  onBookPress: () => void;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  personalData,
  onReviewPress,
  onCommentPress,
  onBookPress
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Details</Text>
      <View style={styles.detailsContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="pricetag-outline" size={24} color="#4B5563" />
          <Text style={styles.detailText}>Category: {personalData.subcategory?.name}</Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="cash-outline" size={24} color="#4B5563" />
          <Text style={styles.detailText}>Price: {personalData.priceperhour}€/hour</Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="information-circle-outline" size={24} color="#4B5563" />
          <Text style={styles.detailText}>Description: {personalData.details}</Text>
        </View>
      </View>
      
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onReviewPress}>
          <View style={styles.iconBackground}>
            <Ionicons name="star-outline" size={32} color="#4A90E2" />
          </View>
          <Text style={styles.actionText}>Reviews</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onCommentPress}>
          <View style={styles.iconBackground}>
            <Ionicons name="chatbubble-outline" size={32} color="#4A90E2" />
          </View>
          <Text style={styles.actionText}>Comments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onBookPress}>
          <View style={styles.iconBackground}>
            <Ionicons name="calendar-outline" size={32} color="#4A90E2" />
          </View>
          <Text style={styles.actionText}>Book</Text>
        </TouchableOpacity>
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    color: '#4B5563',
    fontSize: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  actionButton: {
    alignItems: 'center',
  },
  iconBackground: {
    backgroundColor: '#E6F0FF', // Light blue background
    borderRadius: 50, // To create a circle
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: '#4A90E2',
    marginTop: 8,
    fontSize: 14,
  },
});

export default ServiceDetails;