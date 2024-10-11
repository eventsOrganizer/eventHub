import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PersonalData } from '../../navigation/types';

const PersonalInfo = ({ personalData }: { personalData: PersonalData }) => (
  <View>
    <Text style={styles.name}>{personalData.name}</Text>
    <Text style={styles.category}>
      {personalData.subcategory?.name} - {personalData.subcategory?.category?.name}
    </Text>
    <Text style={styles.price}>${personalData.priceperhour}/hr</Text>
    <View style={styles.ratingContainer}>
      <Ionicons name="star" size={16} color="#FFD700" />
      <Text style={styles.rating}>
        {personalData.rating} ({personalData.reviewCount} reviews)
      </Text>
    </View>
    <Text style={styles.description}>{personalData.description}</Text>
  </View>
);

const styles = StyleSheet.create({
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  category: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    marginLeft: 4,
    fontSize: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
});

export default PersonalInfo;