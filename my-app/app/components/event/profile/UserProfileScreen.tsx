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
      case 'friends':
        return (
          <>
            {/* Friends and Interests List components */}
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

  const handleNavigateToServices = () => {
    navigation.navigate('UserServicesScreen', { userId });
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
          <TouchableOpacity style={styles.createButton} onPress={handleNavigateToServices}>
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

      {/* Secondary Tabs Section */}
      <View style={styles.secondaryTabContainer}>
        <TouchableOpacity style={styles.secondaryTab} onPress={handleNavigateToServices}>
          <Text style={styles.secondaryTabText}>Your Services</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryTab} onPress={() => { /* Future navigation for Your Requests */ }}>
          <Text style={styles.secondaryTabText}>Your Requests</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        {['events', 'friends', 'subscriptions'].map((tab) => (
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
    color: '#fff',
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4500',
    padding: 10,
    borderRadius: 5,
  },
  createButtonText: {
    marginLeft: 5,
    color: '#fff',
    fontWeight: 'bold',
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  requestsButton: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
  requestsButtonText: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    color: '#fff',
    fontSize: 12,
  },
  secondaryTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    elevation: 1,
  },
  secondaryTab: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  secondaryTabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4500',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    elevation: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF4500',
  },
  tabText: {
    fontSize: 16,
    color: '#000',
  },
  activeTabText: {
    color: '#FF4500',
    fontWeight: 'bold',
  },
  content: {
    padding: 10,
  },
  chatButton: {
    backgroundColor: '#FF4500',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    margin: 10,
  },
  chatButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  requestsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
});

export default UserProfileScreen;
