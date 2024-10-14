import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface EventCardProps {
  event: {
    id: number;
    name: string;
    type: string;
    details: string;
    media: { url: string }[];
    subcategory: {
      category: {
        name: string;
      };
      name: string;
    };
    availability: {
      date: string;
      start: string;
      end: string;
    };
    privacy: boolean;
    user_id: string;
  };
  onPress: (event: any) => void;
  children?: React.ReactNode;
}

const EventCard: React.FC<EventCardProps> = ({ event, onPress, children }) => {
  return (
    <TouchableOpacity
      style={styles.eventCardContainer}
      onPress={() => onPress(event)}
    >
      <ImageBackground
        source={{ uri: event.media[0]?.url }}
        style={styles.eventCardBackground}
        imageStyle={styles.eventCardImage}
      >
        <View style={styles.joinButtonContainer}>
          {children}
        </View>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.eventCardGradient}
        >
          <Text style={styles.eventName}>{event.name}</Text>
          <View style={styles.eventInfoContainer}>
            <View style={styles.eventInfoRow}>
              <Ionicons name="calendar-outline" size={12} color="#fff" />
              <Text style={styles.eventInfoText}>{event.availability.date}</Text>
            </View>
            <View style={styles.eventInfoRow}>
              <Ionicons name="time-outline" size={12} color="#fff" />
              <Text style={styles.eventInfoText}>{event.availability.start} - {event.availability.end}</Text>
            </View>
            <View style={styles.eventInfoRow}>
              <Ionicons name="pricetag-outline" size={12} color="#fff" />
              <Text style={styles.eventInfoText}>{event.subcategory.category.name} - {event.subcategory.name}</Text>
            </View>
            <View style={styles.eventInfoRow}>
              <Ionicons name="business-outline" size={12} color="#fff" />
              <Text style={styles.eventInfoText}>{event.type}</Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  eventCardContainer: {
    width: width * 0.45,
    height: height * 0.25,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  eventCardBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  eventCardImage: {
    borderRadius: 10,
  },
  eventCardGradient: {
    padding: 8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
  },
  eventInfoContainer: {
    marginTop: 3,
  },
  eventInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  eventInfoText: {
    fontSize: 10,
    color: '#fff',
    marginLeft: 3,
  },
  joinButtonContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 1,
  },
});

export default EventCard;