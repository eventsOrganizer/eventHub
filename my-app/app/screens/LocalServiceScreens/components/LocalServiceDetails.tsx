import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LocalService } from '../../../services/serviceTypes'; // Adjust import based on your actual type
import moment from 'moment';

interface LocalServiceDetailsProps {
  localServiceDetails: LocalService; // Define the prop type
  onReviewPress: () => void;
  onCommentPress: () => void;
  onBookPress: () => void;
}

const LocalServiceDetails: React.FC<LocalServiceDetailsProps> = ({
  localServiceDetails,
  onReviewPress,
  onCommentPress,
  onBookPress,
}) => {
  // Check if localServiceDetails is provided
  if (!localServiceDetails) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Local Service Details</Text>
      <View style={styles.detailsContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-outline" size={24} color="#4A90E2" />
          <Text>{localServiceDetails.name || 'N/A'}</Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="pricetag-outline" size={24} color="#4A90E2" />
          <Text>{localServiceDetails.priceperhour || 0} per hour</Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="calendar-outline" size={24} color="#4A90E2" />
          <Text>
            {localServiceDetails.startdate ? moment(localServiceDetails.startdate).format('MMMM Do') : 'N/A'} to 
            {localServiceDetails.enddate ? moment(localServiceDetails.enddate).format('MMMM Do YYYY') : 'N/A'}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="information-circle-outline" size={24} color="#4A90E2" />
          <Text>{localServiceDetails.details || 'No details available'}</Text>
        </View>
        {localServiceDetails.subcategory && (
          <View style={styles.iconContainer}>
            <Ionicons name="list-outline" size={24} color="#4A90E2" />
            <Text>
              {localServiceDetails.subcategory.name || 'N/A'} 
              {localServiceDetails.subcategory.category?.name ? ` - ${localServiceDetails.subcategory.category.name}` : ''}
            </Text>
          </View>
        )}
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
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  actionButton: {
    alignItems: 'center',
  },
  iconBackground: {
    backgroundColor: '#E6F2FF',
    borderRadius: 20,
    padding: 8,
  },
  actionText: {
    marginTop: 4,
    color: '#4A90E2',
  },
});

export default LocalServiceDetails;
