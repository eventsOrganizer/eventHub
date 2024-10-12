import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import EventCard from './EventCard';

interface EventSectionProps {
    title: string;
    events: Array<{
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
      };
    }>;
    style?: { marginBottom: number };
    navigation: any; // Add this line
  }

  const EventSection: React.FC<EventSectionProps> = ({ title, events, style, navigation }) => {
    return (
      <View style={[styles.section, style]}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => {
                navigation.navigate('EventDetails', { eventId: event.id });
              }}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default EventSection;