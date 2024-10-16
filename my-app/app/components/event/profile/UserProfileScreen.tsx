import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';
import { useNavigation } from '@react-navigation/native';
import RequestsScreen from './RequestsScreen';
import UserEventsList from './UserEventList';
import AttendedEventsList from './AttendedEventList';
import UserServicesList from './UserServiceList';
import FriendsList from './FriendsList';
import InterestsList from './InterestsList';


interface UserProfile {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  bio?: string;
  avatar_url?: string;
}

const UserProfileScreen: React.FC = () => {
  const { userId } = useUser();
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showRequests, setShowRequests] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [activeTab, setActiveTab] = useState('events');

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchRequestCount();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('user')
      .select('id, email, firstname, lastname, bio')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
    } else if (data) {
      const { data: mediaData } = await supabase
        .from('media')
        .select('url')
        .eq('user_id', userId)
        .single();

      setUserProfile({
        ...data,
        avatar_url: mediaData?.url || 'https://via.placeholder.com/150'
      });
    }
  };

  const fetchRequestCount = async () => {
    if (!userId) return;

    const { data: userEvents, error: eventError } = await supabase
      .from('event')
      .select('id')
      .eq('user_id', userId);

    if (eventError) {
      console.error('Error fetching user events:', eventError);
      return;
    }

    if (userEvents && userEvents.length > 0) {
      const eventIds = userEvents.map(event => event.id);

      const { count, error } = await supabase
        .from('request')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending')
        .in('event_id', eventIds);

      if (error) {
        console.error('Error fetching request count:', error);
      } else {
        setRequestCount(count || 0);
      }
    } else {
      setRequestCount(0);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'events':
        return (
          <>
            <UserEventsList userId={userId as string} />
            <AttendedEventsList userId={userId as string} />
          </>
        );
      case 'services':
        return <UserServicesList userId={userId as string} />;
      case 'friends':
        return (
          <>
            <FriendsList userId={userId as string} />
            <InterestsList userId={userId as string} />
          </>
        );
      default:
        return null;
    }
  };

  const handleCreateEvent = () => {
    navigation.navigate('EventCreation' as never);
  };

  const handleCreateService = () => {
    navigation.navigate('CreateService' as never);
  };
 

  const CreateButton: React.FC<{ onPress: () => void; iconName: string; text: string }> = ({ onPress, iconName, text }) => (
    <TouchableOpacity style={styles.createButton} onPress={onPress}>
      <Ionicons name={iconName} size={24} color="#fff" />
      <Text style={styles.createButtonText}>{text}</Text>
    </TouchableOpacity>
  );

  if (!userProfile || !userId) {
    return <View style={styles.loadingContainer}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
    <LinearGradient colors={['#FF4500', '#FFA500']} style={styles.header}>
      <Image source={{ uri: userProfile.avatar_url }} style={styles.avatar} />
      <Text style={styles.name}>{`${userProfile.firstname} ${userProfile.lastname}`}</Text>
      <Text style={styles.email}>{userProfile.email}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateEvent}>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.createButtonText}>Event</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateService}>
          <Ionicons name="briefcase-outline" size={24} color="#fff" />
          <Text style={styles.createButtonText}>Service</Text>
        </TouchableOpacity>
       
      </View>
      <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile' as never)}>
        <Ionicons name="pencil" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.requestsButton} onPress={() => setShowRequests(!showRequests)}>
          <Ionicons name="notifications" size={24} color="#FF4500" />
          <Text style={styles.requestsButtonText}>{requestCount}</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.tabContainer}>
        {['events', 'services', 'friends'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={[{ key: 'content' }]}
        renderItem={() => (
          <View style={styles.content}>
            {renderTabContent()}
          </View>
        )}
        ListFooterComponent={() => (
          <TouchableOpacity style={styles.chatButton} onPress={() => navigation.navigate('ChatList' as never)}>
            <Ionicons name="chatbubbles" size={24} color="#fff" />
            <Text style={styles.chatButtonText}>Open Chat</Text>
          </TouchableOpacity>
        )}
      />

{showRequests && (
        <View style={styles.requestsOverlay}>
          <RequestsScreen />
          <TouchableOpacity style={styles.closeButton} onPress={() => setShowRequests(false)}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
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
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#fff',
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  requestsButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestsButtonText: {
    color: '#FF4500',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    marginTop: 20,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF4500',
  },
  tabText: {
    fontSize: 16,
    color: '#333',
  },
  activeTabText: {
    color: '#FF4500',
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  chatButton: {
    backgroundColor: '#FFA500',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 30,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  chatButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
  requestsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
    padding: 5,
  },
  createButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    marginBottom: 5,
  },
});

export default UserProfileScreen;
