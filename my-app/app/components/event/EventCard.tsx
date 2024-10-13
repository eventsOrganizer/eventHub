import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Event {
  id: number;
  name: string;
  type: string;
  details: string;
  subcategory: {
    category: {
      name: string;
    };
    name: string;
  };
  media: { url: string }[];
  availability: {
    date: string;
  };
}

interface EventCardProps {
  event: Event;
  onPress: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => {
        console.log('Event card pressed:', event.id);
        onPress(event);
      }}
    >
      <Image source={{ uri: event.media[0]?.url }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{event.name}</Text>
        <Text style={styles.category}>{event.subcategory.category.name} - {event.subcategory.name}</Text>
        <Text style={styles.details} numberOfLines={2}>{event.details}</Text>
        <View style={styles.footer}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.date}>{event.availability.date}</Text>
          </View>
          <Text style={styles.type}>{event.type}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 16,
    width: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  type: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default EventCard;