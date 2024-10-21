import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SuggestToFriendButton from '../suggestions/SuggestToFriendButton';

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
        id: number;
        name: string;
        type: string;
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
      <View style={styles.eventCardFrame}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: event.media[0]?.url }}
            style={styles.eventCardImage}
          />
          <View style={styles.joinButtonContainer}>
            {children}
          </View>
          <View style={styles.suggestButtonContainer}>
            <SuggestToFriendButton itemId={event.id} category={event.subcategory.category} />
          </View>
        </View>
        <View style={styles.eventInfoContainer}>
          <Text style={styles.eventName} numberOfLines={1}>{event.name}</Text>
          <View style={styles.eventInfoRow}>
            <Ionicons name="calendar-outline" size={12} color="#666" />
            <Text style={styles.eventInfoText}>{event.availability.date}</Text>
          </View>
          <View style={styles.eventInfoRow}>
            <Ionicons name="time-outline" size={12} color="#666" />
            <Text style={styles.eventInfoText}>{event.availability.start} - {event.availability.end}</Text>
          </View>
          <View style={styles.eventInfoRow}>
            <Ionicons name="pricetag-outline" size={12} color="#666" />
            <Text style={styles.eventInfoText} numberOfLines={1}>{event.subcategory.category.name} - {event.subcategory.name}</Text>
          </View>
          <View style={styles.eventInfoRow}>
            <Ionicons name="business-outline" size={12} color="#666" />
            <Text style={styles.eventInfoText}>{event.type}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  eventCardContainer: {
    width: width * 0.45,
    height: height * 0.3,
    marginRight: 10,
    marginBottom: 10,
  },
  eventCardFrame: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  imageContainer: {
    height: '60%',
    width: '100%',
    position: 'relative',
  },
  eventCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  eventInfoContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  eventInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  eventInfoText: {
    fontSize: 10,
    color: '#666',
    marginLeft: 5,
  },
  joinButtonContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 1,
  },
  suggestButtonContainer: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 1,
  },
});

export default EventCard;