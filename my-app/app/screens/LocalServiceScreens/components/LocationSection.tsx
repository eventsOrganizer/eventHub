import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LocationMapView from '../../../components/map/LocationMapView';

interface LocationSectionProps {
  address: string;
  distance?: number | null;
  latitude?: number;
  longitude?: number;
  onAddressFound?: (address: string) => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  address,
  distance,
  latitude,
  longitude,
  onAddressFound
}) => {
  if (!latitude || !longitude) {
    return (
      <View style={styles.locationSection}>
        <View style={styles.iconContainer}>
          <Ionicons name="location-outline" size={24} color="#4A90E2" />
          <Text style={styles.addressText}>
            {address}
            {distance && ` (${distance.toFixed(1)} km)`}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.locationSection}>
      <View style={styles.iconContainer}>
        <Ionicons name="location-outline" size={24} color="#4A90E2" />
        <Text style={styles.addressText}>
          {address}
          {distance && ` (${distance.toFixed(1)} km)`}
        </Text>
      </View>
      <View style={styles.mapContainer}>
        <LocationMapView
          latitude={latitude}
          longitude={longitude}
          onAddressFound={onAddressFound}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  locationSection: {
    gap: 8,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressText: {
    flex: 1,
    flexWrap: 'wrap',
    color: '#444',
  },
  mapContainer: {
    height: 200,
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
});