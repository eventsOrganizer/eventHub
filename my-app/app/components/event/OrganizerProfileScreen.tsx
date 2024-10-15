import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import YourEventCard from '../event/YourEventCard';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../../UserContext';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import FriendButton from '../../components/event/profile/FriendButton';
import FollowButton from '../../components/event/profile/FollowButton';

interface OrganizerProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
}

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
  availability: Array<{
    date: string;
    start: string;
    end: string;
    daysofweek: string;
  }>;
}

interface Service {
  id: number;
  name: string;
  type: string;
  details?: string;
}

const OrganizerProfileScreen: React.FC<{ route: { params: { organizerId: string } } }> = ({ route }) => {
  const { organizerId } = route.params;
  const [organizer, setOrganizer] = useState<OrganizerProfile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [showEvents, setShowEvents] = useState(true);
  const [loading, setLoading] = useState(false);
  const { userId: currentUserId } = useUser();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  useEffect(() => {
    fetchOrganizerProfile();
  }, []);

  useEffect(() => {
    if (showEvents) {
      fetchOrganizerEvents();
    } else {
      fetchOrganizerServices();
    }
  }, [showEvents]);

  const fetchOrganizerProfile = async () => {
    console.log('Fetching organizer profile for ID:', organizerId);
    try {
      const { data: allUsers, error: allUsersError } = await supabase
        .from('user')
        .select('id, email, firstname, lastname, bio');
  
      if (allUsersError) {
        console.error('Error fetching all users:', allUsersError);
        return;
      }
  
      if (!allUsers || allUsers.length === 0) {
        console.error('No users found in the database');
        return;
      }
  
      const userData = allUsers.find(user => user.id === organizerId);
  
      if (!userData) {
        console.error('No user data found for organizer ID:', organizerId);
        return;
      }
  
      const { data: mediaData, error: mediaError } = await supabase
        .from('media')
        .select('url')
        .eq('user_id', organizerId)
        .single();
  
      if (mediaError) {
        console.error('Error fetching user media:', mediaError);
      }
  
      setOrganizer({
        id: userData.id,
        email: userData.email,
        full_name: `${userData.firstname || ''} ${userData.lastname || ''}`.trim(),
        bio: userData.bio || '',
        avatar_url: mediaData?.url || 'https://via.placeholder.com/150'
      });
    } catch (error) {
      console.error('Unexpected error in fetchOrganizerProfile:', error);
    }
  };

  const fetchOrganizerEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('event')
      .select(`
        *,
        subcategory (
          name,
          category (
            name
          )
        ),
        media (url),
        availability (date, start, end, daysofweek)
      `)
      .eq('user_id', organizerId);

    if (error) {
      console.error('Error fetching organizer events:', error);
    } else {
      const validEvents = data.filter(event => event.availability && event.availability.length > 0);
      setEvents(validEvents);
    }
    setLoading(false);
  };

  const fetchOrganizerServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('service')
      .select('*')
      .eq('user_id', organizerId);

    if (error) {
      console.error('Error fetching organizer services:', error);
    } else {
      setServices(data);
    }
    setLoading(false);
  };

  if (!organizer) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.coverPhoto}>
        <LinearGradient
          colors={['#FFA500', '#FFD700']}
          style={styles.gradient}
        />
      </View>
      <View style={styles.profileSection}>
        <Image 
          source={{ uri: organizer.avatar_url }} 
          style={styles.avatar} 
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{organizer.full_name}</Text>
          <Text style={styles.email}>{organizer.email}</Text>
          <Text style={styles.bio}>{organizer.bio || 'No bio available'}</Text>
          {currentUserId ? (
            currentUserId !== organizerId ? (
              <>
                <TouchableOpacity
                  style={styles.chatButton}
                  onPress={() => navigation.navigate('ChatRoom', { userId: currentUserId, organizerId })}
                >
                  <Text style={styles.chatButtonText}>Chat with Organizer</Text>
                </TouchableOpacity>
                <FriendButton targetUserId={organizerId} />
                <FollowButton targetUserId={organizerId} />
              </>
            ) : (
              <Text style={styles.loginPrompt}>This is your profile</Text>
            )
          ) : (
            <Text style={styles.loginPrompt}>Log in to interact with the organizer</Text>
          )}
        </View>
      </View>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, showEvents && styles.activeToggle]}
          onPress={() => {
            setShowEvents(true);
            setEvents([]);
          }}
        >
          <Text style={[styles.toggleText, showEvents && styles.activeToggleText]}>Events</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !showEvents && styles.activeToggle]}
          onPress={() => {
            setShowEvents(false);
            setServices([]);
          }}
        >
          <Text style={[styles.toggleText, !showEvents && styles.activeToggleText]}>Services</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#FFA500" />
      ) : (
        <FlatList
          data={showEvents ? events : services}
          renderItem={({ item }) => (
            showEvents ? (
              <TouchableOpacity onPress={() => navigation.navigate('EventDetails', { eventId: item.id })} style={styles.itemContainer}>
                <YourEventCard event={item as any} onPress={() => navigation.navigate('EventDetails', { eventId: item.id })} />
              </TouchableOpacity>
            ) : (
              <View style={styles.serviceItem}>
                <Text style={styles.serviceName}>{item.name}</Text>
                <Text style={styles.serviceType}>{item.type}</Text>
                {item.details && <Text style={styles.serviceDetails}>{item.details}</Text>}
              </View>
            )
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>{showEvents ? 'No events found' : 'No services found'}</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPhoto: {
    height: 150,
  },
  gradient: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    marginTop: -50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  avatar: {
    width: 120,
    height: 192,
    borderRadius: 10,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  bio: {
    fontSize: 14,
    color: '#333',
  },
  chatButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  chatButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginPrompt: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  toggleButton: {
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  toggleText: {
    fontSize: 16,
    color: '#666',
  },
  activeToggle: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFA500',
  },
  activeToggleText: {
    color: '#FFA500',
    fontWeight: 'bold',
  },
  itemContainer: {
    marginBottom: 15,
  },
  serviceItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  serviceType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  serviceDetails: {
    fontSize: 14,
    color: '#333',
  },
  listContent: {
    padding: 15,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});

export default OrganizerProfileScreen;