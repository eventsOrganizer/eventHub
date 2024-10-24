import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service } from '../../services/serviceTypes';

interface PersonalInfoProps {
  data: Service | null;
  onLike: () => void;
  onToggleMap: () => void;
  distance?: number | null;
  address?: string;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ 
  data, 
  onLike, 
  onToggleMap,
  distance,
  address 
}) => {
  if (!data) return null;

  const isLiked = data.like?.some(like => like.user_id) || false;
  const reviewCount = data.review?.length || 0;
  const averageRating = data.review && data.review.length > 0
    ? data.review.reduce((sum, review) => sum + review.rate, 0) / reviewCount
    : null;

  return (
    <View style={styles.infoContainer}>
      <Text style={styles.name}>{data.name}</Text>
      <Text style={styles.price}>${data.priceperhour}/hr</Text>
      <Text style={styles.details}>{data.details}</Text>
      
      {(distance !== null || address) && (
        <View style={styles.locationInfo}>
          {distance !== null && (
            <View style={styles.locationItem}>
              <Ionicons name="location" size={24} color="#fff" />
              <Text style={styles.locationText}>Distance: {distance?.toFixed(1)} km</Text>
            </View>
          )}
          {address && (
            <View style={styles.locationItem}>
              <Ionicons name="map" size={24} color="#fff" />
              <Text style={styles.locationText}>{address}</Text>
            </View>
          )}
        </View>
      )}
      
      <View style={styles.statsContainer}>
        <TouchableOpacity onPress={onLike} style={styles.likeButton}>
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={24} 
            color={isLiked ? "red" : "white"} 
          />
          <Text style={styles.statText}>{data.like?.length || 0} Likes</Text>
        </TouchableOpacity>

        <View style={styles.statItem}>
          <Ionicons name="star" size={24} color="gold" />
          <Text style={styles.statText}>
            {reviewCount} Reviews
            {averageRating !== null && ` (${averageRating.toFixed(1)})`}
          </Text>
        </View>

        <TouchableOpacity onPress={onToggleMap} style={styles.mapButton}>
          <Ionicons name="location" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  price: {
    fontSize: 20,
    color: '#E0E0E0',
    marginBottom: 8,
  },
  details: {
    fontSize: 16,
    marginBottom: 16,
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#3498db',
  },
  statText: {
    marginLeft: 8,
    color: '#fff',
  },
  locationInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    color: '#fff',
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
});

export default PersonalInfo;