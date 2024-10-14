import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import YourEventCard from './YourEventCard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  EventDetails: { eventId: number };
  // Add other routes as needed
};

type UserEventsListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EventDetails'>;

interface Event {
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
    start: string;
    end: string;
  };
  privacy: boolean;
  user_id: string;
}

const UserEventsList: React.FC<{ userId: string }> = ({ userId }) => {
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const navigation = useNavigation<UserEventsListNavigationProp>();

  useEffect(() => {
    fetchUserEvents();
  }, [userId]);

  const fetchUserEvents = async () => {
    const { data, error } = await supabase
      .from('event')
      .select(`
        id, name, type, details,
        media (url),
        subcategory (
          name,
          category (name)
        ),
        availability (date, start, end, daysofweek),
        privacy,
        user_id
      `)
      .eq('user_id', userId);
  
    if (error) {
      console.error('Error fetching user events:', error);
    } else if (data) {
      setUserEvents(data as unknown as Event[]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Events</Text>
      <FlatList
        data={userEvents}
        renderItem={({ item }) => (
          <YourEventCard
            event={item}
            onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
          />
        )}
        keyExtractor={item => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default UserEventsList;