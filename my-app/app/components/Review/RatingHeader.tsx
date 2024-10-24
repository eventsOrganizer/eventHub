import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface RatingHeaderProps {
  averageRating: number;
  totalReviews: number;
}

export const RatingHeader = ({ averageRating, totalReviews }: RatingHeaderProps) => {
  const scaleAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <LinearGradient
      colors={['rgba(126, 87, 194, 0.1)', 'rgba(74, 144, 226, 0.1)']}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.ratingContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Star size={40} color="#FFD700" />
        <Text style={styles.ratingText}>{averageRating.toFixed(1)}</Text>
        <Text style={styles.reviewCount}>
          Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
        </Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8,
  },
  reviewCount: {
    fontSize: 16,
    color: '#666',
    opacity: 0.8,
  },
});