import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LocalService } from '../../../services/serviceTypes';

interface LocalServiceDetailsProps {
  localData: LocalService;
  onReviewPress: () => void;
  onCommentPress: () => void;
  onBookPress: () => void;
  address: string;
  distance: number | null;
}

const LocalServiceDetails: React.FC<LocalServiceDetailsProps> = ({
  localData,
  onReviewPress,
  onCommentPress,
  onBookPress,
  address,
  distance,
}) => {
  if (!localData) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détails du service</Text>
      <View style={styles.detailsContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-outline" size={24} color="#4A90E2" />
          <Text>{localData.name || 'N/A'}</Text>
        </View>
        
        <View style={styles.iconContainer}>
          <Ionicons name="pricetag-outline" size={24} color="#4A90E2" />
          <Text>{localData.priceperhour || 0}€ par heure</Text>
        </View>
        
        <View style={styles.locationSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="location-outline" size={24} color="#4A90E2" />
            <Text style={styles.addressText}>
              {localData.location ? address : 'Données de localisation non disponibles'}
            </Text>
          </View>
        </View>
        
        <View style={styles.amenitiesContainer}>
          <Text style={styles.subtitle}>Équipements:</Text>
          <View style={styles.amenitiesGrid}>
            <View style={styles.amenityItem}>
              <Ionicons 
                name="wifi" 
                size={24} 
                color={localData.subcategory?.amenities?.wifi ? '#4A90E2' : '#666'} 
              />
              <Text style={styles.amenityText}>WiFi</Text>
            </View>
            <View style={styles.amenityItem}>
              <Ionicons 
                name="car" 
                size={24} 
                color={localData.subcategory?.amenities?.parking ? '#4A90E2' : '#666'} 
              />
              <Text style={styles.amenityText}>Parking</Text>
            </View>
            <View style={styles.amenityItem}>
              <Ionicons 
                name="snow" 
                size={24} 
                color={localData.subcategory?.amenities?.aircon ? '#4A90E2' : '#666'} 
              />
              <Text style={styles.amenityText}>Climatisation</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.iconContainer}>
          <Ionicons name="information-circle-outline" size={24} color="#4A90E2" />
          <Text>{localData.details || 'Aucun détail disponible'}</Text>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onReviewPress}>
          <View style={styles.iconBackground}>
            <Ionicons name="star-outline" size={32} color="#4A90E2" />
          </View>
          <Text style={styles.actionText}>Avis</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onCommentPress}>
          <View style={styles.iconBackground}>
            <Ionicons name="chatbubble-outline" size={32} color="#4A90E2" />
          </View>
          <Text style={styles.actionText}>Commentaires</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onBookPress}>
          <View style={styles.iconBackground}>
            <Ionicons name="calendar-outline" size={32} color="#4A90E2" />
          </View>
          <Text style={styles.actionText}>Réserver</Text>
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
  locationSection: {
    gap: 8,
  },
  amenitiesContainer: {
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  amenityItem: {
    alignItems: 'center',
  },
  amenityText: {
    marginTop: 4,
    fontSize: 12,
  },
  addressText: {
    flex: 1,
    flexWrap: 'wrap',
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