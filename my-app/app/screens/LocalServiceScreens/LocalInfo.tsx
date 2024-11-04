import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LocationMapView from '../../components/map/LocationMapView';

interface LocalInfoProps {
  localData: any;
  likes: number;
  userHasLiked: boolean;
  onLike: () => Promise<void>;
  distance: number | null;
  address: string;
  onToggleMap: () => void;
  onAddressFound: (address: string) => void;
}

const LocalInfo: React.FC<LocalInfoProps> = ({
  localData,
  likes,
  userHasLiked,
  onLike,
  distance,
  address,
  onToggleMap,
  onAddressFound,
}) => {
  const [showMap, setShowMap] = useState(false);
  const averageRating = localData?.review?.reduce((acc: number, review: { rate: number }) => acc + review.rate, 0) / (localData?.review?.length || 1);
  const reviewCount = localData?.review?.length || 0;

  const handleToggleMap = () => {
    setShowMap(!showMap);
    onToggleMap();
  };

  const getValidCoordinates = () => {
    console.log('LocalData in getValidCoordinates:', localData);
    
    if (!localData?.location) {
      console.log('No location data available in LocalInfo');
      return null;
    }
    
    const locationData = Array.isArray(localData.location) 
      ? localData.location[0] 
      : localData.location;
    
    console.log('Processed location data:', locationData);
    
    if (!locationData) return null;
    
    const latitude = parseFloat(locationData.latitude);
    const longitude = parseFloat(locationData.longitude);
    
    console.log('Parsed coordinates:', { latitude, longitude });
    
    if (isNaN(latitude) || isNaN(longitude)) {
      console.error('Invalid coordinates:', { 
        originalLat: locationData.latitude,
        originalLon: locationData.longitude,
        parsedLat: latitude,
        parsedLon: longitude
      });
      return null;
    }
    
    return { latitude, longitude };
  };

  const coordinates = getValidCoordinates();

  if (!localData) return null;

  return (
    <View style={styles.infoContainer}>
      <Text style={styles.name}>{localData.name}</Text>

      <View style={styles.statsContainer}>
        <TouchableOpacity onPress={onLike} style={styles.likeButton}>
          <Ionicons 
            name={userHasLiked ? "heart" : "heart-outline"} 
            size={24} 
            color={userHasLiked ? "red" : "#666"} 
          />
          <Text style={styles.statText}>{likes} Likes</Text>
        </TouchableOpacity>

        <View style={styles.statItem}>
          <Ionicons name="star" size={24} color="gold" />
          <Text style={styles.statText}>
            {reviewCount} Reviews
            {averageRating ? ` (${averageRating.toFixed(1)})` : ''}
          </Text>
        </View>

        <TouchableOpacity 
          onPress={handleToggleMap} 
          style={styles.mapButton}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="location" 
            size={24} 
            color="#666"
            style={styles.mapIcon}
          />
          {distance && (
            <Text style={styles.distanceText}>
              {distance.toFixed(1)} km
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {!showMap && (
        <View style={styles.addressContainer}>
          <Text style={styles.addressText}>{address}</Text>
        </View>
      )}

      {showMap && coordinates && (
        <View style={styles.mapContainer}>
          <LocationMapView
            latitude={coordinates.latitude}
            longitude={coordinates.longitude}
            onAddressFound={onAddressFound}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: '#fff',
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
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapButton: {
    padding: 8,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  mapIcon: {
    marginBottom: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 8,
    color: '#444',
  },
  addressContainer: {
    marginTop: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 8,
    borderRadius: 8,
  },
  addressText: {
    color: '#444',
  },
  mapContainer: {
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  distanceText: {
    color: '#444',
    fontSize: 12,
    marginTop: 4,
  },
});

export default LocalInfo;