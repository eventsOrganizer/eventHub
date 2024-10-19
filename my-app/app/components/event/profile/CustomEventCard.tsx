import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import SuggestToFriendButton from '../../suggestions/SuggestToFriendButton';

const { width: screenWidth } = Dimensions.get('window');
const containerWidth = screenWidth - 40;
const cardWidth = (containerWidth - 40) / 3; // 3 cards per row with some gap
const cardHeight = cardWidth; // Square aspect ratio

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
        <View style={styles.textContainer}>
          <Text style={styles.eventName} numberOfLines={1} ellipsizeMode="tail">
            {event.name}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="bookmark-outline" size={16} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="share-outline" size={16} color="#fff" />
          </TouchableOpacity>
          <SuggestToFriendButton itemId={event.id} itemType="event" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: cardWidth,
    height: cardHeight,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  gradientBackground: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
  },
  textContainer: {
    height: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  eventName: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '15%',
    paddingHorizontal: 5,
  },
  button: {
    padding: 5,
  },
});

export default CustomEventCard;