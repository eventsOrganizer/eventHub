import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service } from '../../../services/serviceTypes';
import moment from 'moment';

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
  onBookPress,

}) => {
  // Ajout de cette vérification
  if (!personalData) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Details</Text>
      <View style={styles.detailsContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-outline" size={24} color="#4A90E2" />
          <Text>{personalData.name || 'N/A'}</Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="pricetag-outline" size={24} color="#4A90E2" />
          <Text>{personalData.priceperhour || 0} per hour</Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="calendar-outline" size={24} color="#4A90E2" />
          {/* <Text>from {moment().format(personalData.startdate) || 'N/A'} to {moment().format(personalData.enddate) || 'N/A'}</Text> */}
          <Text>{personalData.startdate ? moment(personalData.startdate).format('MMMM Do') : 'N/A'} to {personalData.enddate ? moment(personalData.enddate).format('MMMM Do YYYY') : 'N/A'}</Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="information-circle-outline" size={24} color="#4A90E2" />
          <Text>{personalData.details || 'No details available'}</Text>
        </View>
        {personalData.subcategory && (
          <View style={styles.iconContainer}>
            <Ionicons name="list-outline" size={24} color="#4A90E2" />
            <Text>
              {personalData.subcategory.name || 'N/A'} 
              {personalData.subcategory.category?.name ? ` - ${personalData.subcategory.category.name}` : ''}
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

export default ServiceDetails;
