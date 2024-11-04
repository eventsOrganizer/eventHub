import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { BlurView } from 'expo-blur';
import SuggestToFriendButton from '../suggestions/SuggestToFriendButton';
import { theme } from '../../../lib/theme';

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
  children?: React.ReactNode;
}

const YourEventCard: React.FC<YourEventCardProps> = ({ event, onPress, children }) => {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'spring',
        damping: 15,
        stiffness: 200,
      }}
    >
      <TouchableOpacity 
        style={styles.eventCardContainer} 
        onPress={() => onPress(event)}
        activeOpacity={0.97}
      >
        <ImageBackground 
          source={{ uri: event.media[0]?.url }} 
          style={styles.eventCardBackground} 
          imageStyle={styles.eventCardImage}
        >
          <BlurView intensity={20} tint="dark" style={styles.overlay}>
            <View style={styles.actionButtonsContainer}>
              <View style={styles.suggestButtonContainer}>
                <SuggestToFriendButton itemId={event.id} category={event.subcategory.category} />
              </View>
              <View style={styles.joinButtonContainer}>
                {children}
              </View>
            </View>

            <View style={styles.contentContainer}>
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.eventCardGradient}
              >
                <Text style={styles.eventName}>{event.name}</Text>
                
                <View style={styles.eventInfoContainer}>
                  <View style={styles.eventInfoRow}>
                    <View style={styles.iconContainer}>
                      <Ionicons name="calendar-outline" size={16} color={theme.colors.accent} />
                    </View>
                    <Text style={styles.eventInfoText}>{event.availability.date}</Text>
                  </View>

                  <View style={styles.eventInfoRow}>
                    <View style={styles.iconContainer}>
                      <Ionicons name="time-outline" size={16} color={theme.colors.accent} />
                    </View>
                    <Text style={styles.eventInfoText}>
                      {`${event.availability.start} - ${event.availability.end}`}
                    </Text>
                  </View>

                  <View style={styles.eventInfoRow}>
                    <View style={styles.iconContainer}>
                      <Ionicons name="pricetag-outline" size={16} color={theme.colors.accent} />
                    </View>
                    <Text style={styles.eventInfoText}>
                      {`${event.subcategory.category.name} - ${event.subcategory.name}`}
                    </Text>
                  </View>

                  <View style={styles.eventInfoRow}>
                    <View style={styles.iconContainer}>
                      <Ionicons name="business-outline" size={16} color={theme.colors.accent} />
                    </View>
                    <Text style={styles.eventInfoText}>{event.type}</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </BlurView>
        </ImageBackground>
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  eventCardContainer: {
    width: width - 32,
    height: (height * 0.7 - 40) / 3,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.cardBg,
    shadowColor: theme.colors.eventShadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  eventCardBackground: {
    flex: 1,
    justifyContent: 'space-between',
  },
  eventCardImage: {
    borderRadius: theme.borderRadius.lg,
  },
  overlay: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.sm,
  },
  contentContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  eventCardGradient: {
    padding: theme.spacing.md,
    borderBottomLeftRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.lg,
  },
  eventName: {
    ...theme.typography.title,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  eventInfoContainer: {
    gap: theme.spacing.xs,
  },
  eventInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.xs,
  },
  eventInfoText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  joinButtonContainer: {
    zIndex: 1,
  },
  suggestButtonContainer: {
    zIndex: 1,
  },
});

export default YourEventCard;