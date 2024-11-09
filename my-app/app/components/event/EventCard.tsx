import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SuggestToFriendButton from '../suggestions/SuggestToFriendButton';
import tw from 'twrnc';

const { width, height } = Dimensions.get('window');

interface EventCardProps {
  event: {
    id: number;
    name: string;
    description: string;
    type: string;
    media?: { url: string }[];
    subcategory: {
      name: string;
      category: {
        id: number;
        name: string;
        type: string;
      };
    };
    availability?: Array<{
      date: string;
      start: string;
      end: string;
    }>;
  };
  onPress?: () => void;
  children?: React.ReactNode;
}

const EventCard: React.FC<EventCardProps> = ({ event, onPress, children }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.eventCardContainer}>
      <View style={styles.eventCardFrame}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: event.media?.[0]?.url || 'https://via.placeholder.com/150' }}
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
          <Text numberOfLines={1} style={styles.eventName}>
            {event.name}
          </Text>
          
          {event.availability?.[0] && (
            <>
              <View style={styles.eventInfoRow}>
                <Ionicons name="calendar-outline" size={14} color="#666" />
                <Text style={styles.eventInfoText}>
                  {formatDate(event.availability[0].date)}
                </Text>
              </View>
              <View style={styles.eventInfoRow}>
                <Ionicons name="time-outline" size={14} color="#666" />
                <Text style={styles.eventInfoText}>
                  {event.availability[0].start} - {event.availability[0].end}
                </Text>
              </View>
            </>
          )}

          <View style={styles.eventInfoRow}>
            <Ionicons name="pricetag-outline" size={14} color="#666" />
            <Text style={styles.eventInfoText}>
              {event.subcategory.category.name} • {event.subcategory.name}
            </Text>
          </View>

          <View style={styles.eventInfoRow}>
            <Ionicons name="business-outline" size={14} color="#666" />
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
    marginBottom: 4,
  },
  eventInfoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
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