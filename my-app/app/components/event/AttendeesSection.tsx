import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { LinearGradient } from 'expo-linear-gradient';
import UserAvatar from './UserAvatar';

interface AttendeesSectionProps {
  eventId: number;
  refreshTrigger: number;
}

interface Attendee {
  id: string;
}

const AttendeesSection: React.FC<AttendeesSectionProps> = ({ eventId, refreshTrigger }) => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    fetchAttendees();
  }, [refreshTrigger]);

  const fetchAttendees = async () => {
    const { data, error } = await supabase
      .from('event_has_user')
      .select('user_id')
      .eq('event_id', eventId);

    if (error) {
      console.error('Error fetching attendees:', error);
      return;
    }

    setAttendees(data.map(item => ({ id: item.user_id })));
  };

  const renderAttendee = ({ item }: { item: Attendee }) => (
    <View style={styles.attendeeItem}>
      <UserAvatar userId={item.id} size={50} />
    </View>
  );

  return (
    <LinearGradient
      colors={['#FF8C00', '#FFA500']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.title}>Attendees ({attendees.length})</Text>
      <FlatList
        data={attendees}
        renderItem={renderAttendee}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.attendeesList}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  attendeesList: {
    paddingVertical: 10,
  },
  attendeeItem: {
    marginRight: 10,
  },
});

export default AttendeesSection;