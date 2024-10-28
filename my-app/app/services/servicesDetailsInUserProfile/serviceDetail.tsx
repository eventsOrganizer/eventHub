import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service } from '../../services/serviceTypes';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import LocationMap from '../../screens/PersonalServiceScreen/components/LocationMap';

interface ServiceDetailsProps {
  serviceData: Service;
  distance?: number | null;
  address?: string;
  serviceType: 'Personal' | 'Local' | 'Material';
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  serviceData,
  distance,
  address,
  serviceType
}) => {
  const averageRating = serviceData.review?.length 
    ? serviceData.review.reduce((acc, rev) => acc + rev.rate, 0) / serviceData.review.length 
    : 0;

  const formatDistance = (distance: number | null | undefined) => {
    if (typeof distance === 'number') {
      return `(${distance.toFixed(1)} km)`;
    }
    return '';
  };

  // Extraire les coordonnées de localisation
  const locationData = Array.isArray(serviceData.location) ? serviceData.location[0] : serviceData.location;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Détails du service</Text>
        <Text style={styles.price}>
          {serviceData.priceperhour}€/heure
        </Text>
      </View>

      <View style={styles.categoryInfo}>
        <Ionicons name="folder-outline" size={20} color="#FFF" />
        <Text style={styles.categoryText}>
          {serviceData.subcategory?.category?.name} - {serviceData.subcategory?.name}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="heart" size={20} color="#FFF" />
          <Text style={styles.statText}>
            {serviceData.like?.length || 0} likes
          </Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="star" size={20} color="#FFF" />
          <Text style={styles.statText}>
            {averageRating.toFixed(1)} ({serviceData.review?.length || 0} avis)
          </Text>
        </View>
      </View>

      <View style={styles.separator} />

      <View style={styles.infoSection}>
        {locationData && locationData.latitude && locationData.longitude && (
          <>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#FFF" />
              <Text style={styles.infoText}>
                {address || 'Adresse non disponible'} {formatDistance(distance)}
              </Text>
            </View>
            <View style={styles.mapContainer}>
              <LocationMap
                latitude={locationData.latitude}
                longitude={locationData.longitude}
                address={address || 'Adresse non disponible'}
              />
            </View>
          </>
        )}

        <View style={styles.infoRow}>
          <Ionicons name="cash-outline" size={20} color="#FFF" />
          <Text style={styles.infoText}>
            Acompte requis: {serviceData.percentage || 25}%
          </Text>
        </View>
      </View>

      <View style={styles.separator} />

      <Text style={styles.descriptionTitle}>Description</Text>
      <Text style={styles.description}>{serviceData.details}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryText: {
    color: '#FFF',
    marginLeft: 8,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#FFF',
    marginLeft: 8,
    fontSize: 16,
  },
  infoSection: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    color: '#FFF',
    fontSize: 14,
    flex: 1,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  description: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.9,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 15,
  },
  mapContainer: {
    height: 200,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default ServiceDetails;
