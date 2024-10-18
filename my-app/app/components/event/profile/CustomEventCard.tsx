import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');
const cardWidth = (width - 50) / 2; // 2 cards per row with some padding

interface CustomEventCardProps {
  event: {
    id: number;
    name: string;
    media: { url: string }[];
  };
  onPress: () => void;
}

const CustomEventCard: React.FC<CustomEventCardProps> = ({ event, onPress }) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <LinearGradient
        colors={['#1a1a1a', '#2a2a2a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <Image source={{ uri: event.media[0]?.url || 'https://via.placeholder.com/150' }} style={styles.image} />
        <BlurView intensity={80} tint="dark" style={styles.blurOverlay}>
          <Text style={styles.eventName} numberOfLines={2} ellipsizeMode="tail">
            {event.name}
          </Text>
        </BlurView>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: cardWidth,
    aspectRatio: 3/4,
    borderRadius: 15,
    overflow: 'hidden',
    margin: 5,
  },
  gradientBackground: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  blurOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  eventName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CustomEventCard;