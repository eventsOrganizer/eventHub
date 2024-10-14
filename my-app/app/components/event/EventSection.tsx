import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EventCard from './EventCard';
import YourEventCard from './YourEventCard';
import JoinEventButton from './JoinEventButton';
const { width, height } = Dimensions.get('window');

interface EventSectionProps {
  title: string;
  events: Array<any>;
  navigation: any;
  onSeeAll: () => void;
  isTopEvents: boolean;
}

const EventSection: React.FC<EventSectionProps> = ({ title, events, navigation, onSeeAll, isTopEvents }) => {
  const renderEventCard = ({ item }: { item: any }) => (
    isTopEvents ? (
      <EventCard 
        key={item.id}
        event={item}
        onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
      >
        <JoinEventButton
          eventId={item.id}
          privacy={item.privacy}
          organizerId={item.user_id}
          onJoinSuccess={() => {}}
          onLeaveSuccess={() => {}}
        />
      </EventCard>
    ) : (
      <YourEventCard 
        key={item.id}
        event={item}
        onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
      >
        <JoinEventButton
          eventId={item.id}
          privacy={item.privacy}
          organizerId={item.user_id}
          onJoinSuccess={() => {}}
          onLeaveSuccess={() => {}}
        />
      </YourEventCard>
    )
  );

  return (
    <View style={[styles.section, { height: isTopEvents ? 'auto' : height * 0.7 }]}>
      <View style={styles.gradientBackground}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <TouchableOpacity onPress={onSeeAll} style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See All</Text>
            <Ionicons name="arrow-forward" size={16} color="#333" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={events}
          renderItem={renderEventCard}
          keyExtractor={(item) => item.id.toString()}
          horizontal={isTopEvents}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={isTopEvents ? styles.topEventList : styles.yourEventList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 15,
  },
  gradientBackground: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  seeAllText: {
    color: '#333',
    marginRight: 3,
    fontWeight: '600',
    fontSize: 12,
  },
  topEventList: {
    paddingBottom: 5,
  },
  yourEventList: {
    paddingBottom: 5,
  },
});

export default EventSection;