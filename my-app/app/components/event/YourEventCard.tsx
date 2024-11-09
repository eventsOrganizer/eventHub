import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import SuggestToFriendButton from '../suggestions/SuggestToFriendButton';

const { width, height } = Dimensions.get('window');

interface YourEventCardProps {
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
  };
  onPress: (event: any) => void;
  children?: React.ReactNode
}

const YourEventCard: React.FC<YourEventCardProps> = ({ event, onPress, children }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <TouchableOpacity style={styles.eventCardContainer} onPress={() => onPress(event)}>
      <ImageBackground source={{ uri: event.media[0]?.url }} style={styles.eventCardBackground} imageStyle={styles.eventCardImage}>
        <View style={styles.joinButtonContainer}>
          {children}
        </View>
        <View style={styles.suggestButtonContainer}>
          <SuggestToFriendButton itemId={event.id} category={event.subcategory.category} />
        </View>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.eventCardGradient}
        >
          <Text style={styles.eventName}>{event.name}</Text>
          <View style={styles.eventInfoContainer}>
            {event.availability?.[0] && (
              <>
                <View style={styles.eventInfoRow}>
                  <Ionicons name="calendar-outline" size={14} color="#fff" />
                  <Text style={styles.eventInfoText}>{formatDate(event.availability[0].date)}</Text>
                </View>
                <View style={styles.eventInfoRow}>
                  <Ionicons name="time-outline" size={14} color="#fff" />
                  <Text style={styles.eventInfoText}>{`${event.availability[0].start} - ${event.availability[0].end}`}</Text>
                </View>
              </>
            )}
            <View style={styles.eventInfoRow}>
              <Ionicons name="pricetag-outline" size={14} color="#fff" />
              <Text style={styles.eventInfoText}>{`${event.subcategory.category.name} - ${event.subcategory.name}`}</Text>
            </View>
            <View style={styles.eventInfoRow}>
              <Ionicons name="business-outline" size={14} color="#fff" />
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
    width: width - 40,
    height: (height * 0.7 - 40) / 3,
    marginBottom: 10,
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
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  eventInfoContainer: {
    marginTop: 5,
  },
  eventInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  eventInfoText: {
    fontSize: 12,
    color: '#fff',
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

export default YourEventCard;