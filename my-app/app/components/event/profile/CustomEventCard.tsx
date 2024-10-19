import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import SuggestToFriendButton from '../../suggestions/SuggestToFriendButton';

const { width: screenWidth } = Dimensions.get('window');
const containerWidth = screenWidth - 40;
const cardWidth = (containerWidth - 20) / 2; // 2 cards per row with some gap
const cardHeight = cardWidth * 1.5; // Taller aspect ratio

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
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
        style={styles.gradientBackground}
      >
        <Image source={{ uri: event.media[0]?.url || 'https://via.placeholder.com/150' }} style={styles.image} />
        <View style={styles.overlay}>
          <View style={styles.textContainer}>
            <Text style={styles.eventName} numberOfLines={2} ellipsizeMode="tail">
              {event.name}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <Ionicons name="bookmark-outline" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Ionicons name="share-outline" size={22} color="#fff" />
            </TouchableOpacity>
            <SuggestToFriendButton itemId={event.id} itemType="event" />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: cardWidth,
    height: cardHeight,
    marginBottom: 15,
    marginHorizontal: 5,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradientBackground: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 15,
  },
  textContainer: {
    justifyContent: 'flex-start',
  },
  eventName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
});

export default CustomEventCard;