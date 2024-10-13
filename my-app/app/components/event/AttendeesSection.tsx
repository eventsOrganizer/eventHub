import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

interface AttendeesSectionProps {
  eventId: number;
  refreshTrigger: number;
}

interface Attendee {
  id: string;
  avatar_url: string;
}

const AttendeesSection: React.FC<AttendeesSectionProps> = ({ eventId, refreshTrigger }) => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const navigation = useNavigation();

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

    const userIds = data.map(item => item.user_id);
    const { data: userData, error: userError } = await supabase
      .from('media')
      .select('user_id, url')
      .in('user_id', userIds);

    if (userError) {
      console.error('Error fetching user data:', userError);
      return;
    }

    setAttendees(userData.map(user => ({ id: user.user_id, avatar_url: user.url })));
  };

  const renderAttendee = ({ item }: { item: Attendee }) => (
    <TouchableOpacity 
      style={styles.attendeeItem}
      onPress={() => navigation.navigate('OrganizerProfile', { organizerId: item.id })}
    >
      <Image 
        source={{ uri: item.avatar_url || 'https://via.placeholder.com/50' }} 
        style={styles.attendeeAvatar} 
      />
    </TouchableOpacity>
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
  attendeeAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});

export default AttendeesSection;