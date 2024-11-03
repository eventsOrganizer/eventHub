import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service } from '../../services/serviceTypes';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import LocationMap from '../../screens/PersonalServiceScreen/components/LocationMap';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

interface ServiceDetailsProps {
  serviceData: Service;
  serviceType: 'Personal' | 'Local' | 'Material';
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  serviceData,
  serviceType
}) => {
  const [address, setAddress] = useState<string>('Chargement de l\'adresse...');
  const [distance, setDistance] = useState<number | null>(null);

  const averageRating = serviceData.review?.length 
    ? serviceData.review.reduce((acc, rev) => acc + rev.rate, 0) / serviceData.review.length 
    : 0;

  const locationData = Array.isArray(serviceData.location) 
    ? serviceData.location[0] 
    : serviceData.location;

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=fr&email=your-email@domain.com`,
        {
          headers: {
            'User-Agent': 'YourApp/1.0',
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        console.error('Erreur de réponse:', response.status, response.statusText);
        const text = await response.text();
        console.error('Contenu de la réponse:', text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      return data.display_name || 'Adresse non trouvée';
    } catch (error) {
      console.error('Erreur détaillée lors de la récupération de l\'adresse:', error);
      return 'Adresse non disponible pour le moment';
    }
  };

  useEffect(() => {
    const fetchLocationData = async () => {
      if (locationData?.latitude && locationData?.longitude) {
        try {
          // Récupérer l'adresse
          const addressResult = await getAddressFromCoordinates(
            locationData.latitude,
            locationData.longitude
          );
          setAddress(addressResult);

          // Récupérer la position actuelle et calculer la distance
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const currentLocation = await Location.getCurrentPositionAsync({});
            const calculatedDistance = calculateDistance(
              currentLocation.coords.latitude,
              currentLocation.coords.longitude,
              locationData.latitude,
              locationData.longitude
            );
            setDistance(calculatedDistance);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données de localisation:', error);
          setAddress('Adresse non disponible pour le moment');
        }
      }
    };

    fetchLocationData();
  }, [locationData]);

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

      {locationData && (
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#FFF" />
            <Text style={styles.infoText}>
              {address} {distance ? `(${distance.toFixed(1)} km)` : ''}
            </Text>
          </View>
          <View style={styles.mapContainer}>
            <LocationMap
              latitude={locationData.latitude}
              longitude={locationData.longitude}
              address={address}
            />
          </View>
        </View>
      )}

      <View style={styles.infoRow}>
        <Ionicons name="cash-outline" size={20} color="#FFF" />
        <Text style={styles.infoText}>
          Acompte requis: {serviceData.percentage || 25}%
        </Text>
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
