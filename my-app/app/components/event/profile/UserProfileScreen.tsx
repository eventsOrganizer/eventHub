import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
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
import Subscriptions from './Subscriptions';
import FriendRequestBadge from './FriendRequestBadge';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchRequestCount();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    if (!userId) return;
  
    try {
      const { data, error } = await supabase
        .from('user')
        .select('id, email, firstname, lastname, bio')
        .eq('id', userId);
  
      if (error) throw error;
  
      if (!data || data.length === 0) {
        console.error('No user data found');
        setUserProfile(null);
        return;
      }
  
      const userData = data[0];
  
      const { data: mediaData, error: mediaError } = await supabase
        .from('media')
        .select('url')
        .eq('user_id', userId)
        .single();
  
      if (mediaError && mediaError.code !== 'PGRST116') throw mediaError;
  
      setUserProfile({
        ...userData,
        avatar_url: mediaData?.url || 'https://via.placeholder.com/150'
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequestCount = async () => {
    if (!userId) return;

    try {
      const { data: userEvents, error: eventError } = await supabase
        .from('event')
        .select('id')
        .eq('user_id', userId);

      if (eventError) throw eventError;

      if (userEvents && userEvents.length > 0) {
        const eventIds = userEvents.map(event => event.id);

        const { count, error } = await supabase
          .from('request')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending')
          .in('event_id', eventIds);

        if (error) throw error;

        setRequestCount(count || 0);
      } else {
        setRequestCount(0);
      }
    } catch (error) {
      console.error('Error fetching request count:', error);
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
      case 'subscriptions':
        return <Subscriptions />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4500" />
      </View>
    );
  }

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
    return <View style={styles.loadingContainer}><Text>No user data available</Text></View>;
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
        <FriendRequestBadge />
      </LinearGradient>

      <View style={styles.tabContainer}>
        {['events', 'services', 'friends', 'subscriptions'].map((tab) => (
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
          <TouchableOpacity 
            style={styles.chatButton} 
            onPress={() => navigation.navigate('ChatList' as never)}
          >
            <Ionicons name="chatbubbles" size={24} color="#fff" />
            <Text style={styles.chatButtonText}>Open Chat</Text>
          </TouchableOpacity>
        )}
      />

{showRequests && (
        <View style={styles.requestsOverlay}>
          <RequestsScreen />
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setShowRequests(false)}
          >
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
    width: 100,
    height: 100,
    borderRadius: 50,
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
    borderRadius: 20,
    padding: 5,
  },
  requestsButtonText: {
    color: '#FF4500',
    fontWeight: 'bold',
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 20,
    height: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    paddingVertical: 5,
    paddingHorizontal: 20,
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
    flex: 1,
    padding: 20,
  },
  chatButton: {
    backgroundColor: '#FF4500',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  requestsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
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
