import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, RefreshControl } from 'react-native';
import { supabase } from '../../../services/supabaseClient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomEventCard from './CustomEventCard';

type RootStackParamList = {
  EventDetails: { eventId: number };
};

type AttendedEventsListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EventDetails'>;

interface Event {
  id: number;
  name: string;
  media: { url: string }[];
}

const { width: screenWidth } = Dimensions.get('window');
const containerWidth = screenWidth - 40; // Adjust container width
const cardWidth = (containerWidth - 40) / 3; // 3 cards per row with some gap
const cardHeight = cardWidth; // Square aspect ratio

const AttendedEventsList: React.FC<{ userId: string }> = ({ userId }) => {
  const [attendedEvents, setAttendedEvents] = useState<Event[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<AttendedEventsListNavigationProp>();

  const fetchAttendedEvents = useCallback(async () => {
    const { data, error } = await supabase
      .from('event_has_user')
      .select(`
        event:event_id (
          id, name,
          media (url)
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching attended events:', error);
    } else if (data) {
      setAttendedEvents(data.map(item => item.event) as unknown as Event[]);
    }
  }, [userId]);

  useEffect(() => {
    fetchAttendedEvents();
  }, [fetchAttendedEvents]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAttendedEvents();
    setRefreshing(false);
  }, [fetchAttendedEvents]);

  const renderEventCard = (event: Event) => (
    <CustomEventCard
      key={event.id}
      event={event}
      onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
    />
  );

  const renderEventPages = () => {
    const pages = [];
    for (let i = 0; i < attendedEvents.length; i += 9) {
      const pageEvents = attendedEvents.slice(i, i + 9);
      pages.push(
        <View key={i} style={styles.page}>
          {pageEvents.map(renderEventCard)}
        </View>
      );
    }
    return pages;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attended Events</Text>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollViewContent}
      >
        {attendedEvents.length > 0 ? (
          renderEventPages()
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No attended events found.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    height: cardHeight * 3 + 80, // Adjust this to fit 3 rows of cards plus some padding
    width: containerWidth,
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FFFFFF',
    paddingHorizontal: 10,
  },
  scrollViewContent: {
    alignItems: 'flex-start',
  },
  page: {
    width: containerWidth,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyContainer: {
    width: containerWidth,
    height: cardHeight * 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default AttendedEventsList;