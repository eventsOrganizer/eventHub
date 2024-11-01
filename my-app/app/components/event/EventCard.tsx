import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../lib/theme';
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
      activeOpacity={0.7}
    >
      <View style={styles.eventCardFrame}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: event.media[0]?.url }}
            style={styles.eventCardImage}
          />
          <View style={styles.overlay} />
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
            <Ionicons name="calendar-outline" size={16} color={theme.colors.eventIcon} />
            <Text style={styles.eventInfoText}>{event.availability.date}</Text>
          </View>
          <View style={styles.eventInfoRow}>
            <Ionicons name="time-outline" size={16} color={theme.colors.eventIcon} />
            <Text style={styles.eventInfoText}>
              {event.availability.start} - {event.availability.end}
            </Text>
          </View>
          <View style={styles.eventInfoRow}>
            <Ionicons name="pricetag-outline" size={16} color={theme.colors.eventIcon} />
            <Text style={styles.eventInfoText} numberOfLines={1}>
              {event.subcategory.category.name} - {event.subcategory.name}
            </Text>
          </View>
          <View style={styles.eventInfoRow}>
            <Ionicons name="business-outline" size={16} color={theme.colors.eventIcon} />
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
    height: height * 0.35,
    marginRight: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  eventCardFrame: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.eventBorder,
    backgroundColor: theme.colors.eventBackground,
    ...(typeof theme.shadows.md === 'object' ? theme.shadows.md : {}),
  },
  imageContainer: {
    height: '55%',
    width: '100%',
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  eventCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  eventName: {
    ...theme.typography.subtitle,
    color: theme.colors.eventTitle,
    marginBottom: theme.spacing.xs,
  },
  eventInfoContainer: {
    flex: 1,
    backgroundColor: theme.colors.eventBackground,
    padding: theme.spacing.md,
  },
  eventInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  eventInfoText: {
    ...theme.typography.caption,
    color: theme.colors.eventText,
  },
  joinButtonContainer: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    zIndex: 1,
  },
  suggestButtonContainer: {
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    zIndex: 1,
  },
});

export default EventCard;