import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import { Service } from '../../services/serviceTypes';
import { theme } from '../../../lib/theme';

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
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 15 }}
    >
      <BlurView intensity={80} tint="light" style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.price}>${data.priceperhour}/hr</Text>
          <Text style={styles.details}>{data.details}</Text>
          
          {(distance !== null || address) && (
            <View style={styles.locationInfo}>
              {distance !== null && (
                <View style={styles.locationItem}>
                  <Ionicons name="location" size={24} color={theme.colors.accent} />
                  <Text style={styles.locationText}>Distance: {distance?.toFixed(1)} km</Text>
                </View>
              )}
              {address && (
                <View style={styles.locationItem}>
                  <Ionicons name="map" size={24} color={theme.colors.accent} />
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
                color={isLiked ? theme.colors.error : theme.colors.accent} 
              />
              <Text style={styles.statText}>{data.like?.length || 0} Likes</Text>
            </TouchableOpacity>

            <View style={styles.statItem}>
              <Ionicons name="star" size={24} color={theme.colors.warning} />
              <Text style={styles.statText}>
                {reviewCount} Reviews
                {averageRating !== null && ` (${averageRating.toFixed(1)})`}
              </Text>
            </View>

            <TouchableOpacity onPress={onToggleMap} style={styles.mapButton}>
              <Ionicons name="location" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  infoContainer: {
    padding: theme.spacing.lg,
  },
  name: {
    ...theme.typography.title,
    color: theme.colors.personalDetailTitle,
    marginBottom: theme.spacing.sm,
  },
  price: {
    ...theme.typography.subtitle,
    color: theme.colors.accent,
    marginBottom: theme.spacing.sm,
  },
  details: {
    ...theme.typography.body,
    color: theme.colors.personalDetailText,
    marginBottom: theme.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: theme.spacing.md,
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
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.accent,
  },
  statText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.personalDetailText,
    ...theme.typography.body,
  },
  locationInfo: {
    backgroundColor: theme.colors.overlay,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  locationText: {
    color: theme.colors.personalDetailText,
    marginLeft: theme.spacing.sm,
    flex: 1,
    ...theme.typography.body,
  },
});

export default PersonalInfo;