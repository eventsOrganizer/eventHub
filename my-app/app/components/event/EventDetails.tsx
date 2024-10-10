import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

interface Event {
  name: string;
  type: string;
  subcategory: {
    category: {
      name: string;
    };
    name: string;
  };
  details: string;
  privacy: boolean;
  location: {
    longitude: number;
    latitude: number;
  };
  availability: {
    daysofweek: string;
    start: string;
    end: string;
    date: string;
  };
  media: { url: string }[];
}

const EventDetails: React.FC<{ event: Event }> = ({ event }) => {
  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: event.media[0]?.url }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{event.name}</Text>
        <Text style={styles.type}>{event.type}</Text>
        <Text style={styles.category}>{event.subcategory.category.name} - {event.subcategory.name}</Text>
        <Text style={styles.details}>{event.details}</Text>
        <Text style={styles.privacy}>{event.privacy ? 'Private' : 'Public'}</Text>
        <Text style={styles.location}>Location: {event.location.longitude}, {event.location.latitude}</Text>
        <Text style={styles.availability}>
          Available: {event.availability.daysofweek} {event.availability.start} - {event.availability.end}
        </Text>
        <Text style={styles.date}>Date: {event.availability.date}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  type: {
    fontSize: 18,
    color: 'gray',
  },
  category: {
    fontSize: 18,
    color: 'blue',
  },
  details: {
    fontSize: 16,
    marginTop: 8,
  },
  privacy: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  location: {
    fontSize: 16,
    marginTop: 8,
  },
  availability: {
    fontSize: 16,
    marginTop: 8,
  },
  date: {
    fontSize: 16,
    marginTop: 8,
  },
});

export default EventDetails;