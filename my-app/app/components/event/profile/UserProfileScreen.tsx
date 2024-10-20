import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView, Animated, RefreshControl, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';
import { useNavigation } from '@react-navigation/native';
import EventRequestBadge from './EventRequestBadge';
import UserEventsList from './UserEventList';
import AttendedEventsList from './AttendedEventList';
import UserServicesList from './UserServiceList';
import FriendsList from './FriendsList';
import InterestsList from './InterestsList';
import Subscriptions from './Subscriptions';
import FriendRequestBadge from './FriendRequestBadge';
<<<<<<< HEAD
import ServiceRequestsList from '../../../components/ServiceRequestsList';
=======
import InvitationButton from './InvitationButton';
import { BlurView } from 'expo-blur';
import tw from 'twrnc';

const { width: screenWidth } = Dimensions.get('window');
>>>>>>> a5147af5ba73dc090fe26cb310eb41c7cf6a67ec

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
  const [refreshing, setRefreshing] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));
  const [activeEventList, setActiveEventList] = useState<'your' | 'attended'>('your');

  const fetchData = useCallback(async () => {
    if (userId) {
      await Promise.all([fetchUserProfile()]);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

const fetchUserProfile = async () => {
  if (!userId) return;

  setLoading(true);
  try {
    const { data, error } = await supabase
      .from('user')
      .select('id, email, firstname, lastname, bio')
      .eq('id', userId)
      .single();

    if (error) throw error;

    const { data: mediaData, error: mediaError } = await supabase
      .from('media')
      .select('url')
      .eq('user_id', userId)
      .single();

    if (mediaError && mediaError.code !== 'PGRST116') throw mediaError;

    setUserProfile({
      ...data,
      avatar_url: mediaData?.url || 'https://via.placeholder.com/150',
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
  } finally {
    setLoading(false);
  }
};

 
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'events':
        return (
          <View style={tw`space-y-6`}>
            <View style={tw`flex-row justify-around mb-4`}>
              <TouchableOpacity
                style={tw`bg-[#00BFFF] py-2 px-4 rounded-full ${activeEventList === 'your' ? 'opacity-100' : 'opacity-50'}`}
                onPress={() => setActiveEventList('your')}
              >
                <Text style={tw`text-white font-bold`}>Your Events</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-[#00BFFF] py-2 px-4 rounded-full ${activeEventList === 'attended' ? 'opacity-100' : 'opacity-50'}`}
                onPress={() => setActiveEventList('attended')}
              >
                <Text style={tw`text-white font-bold`}>Attended Events</Text>
              </TouchableOpacity>
            </View>
            {activeEventList === 'your' && <UserEventsList userId={userId as string} />}
            {activeEventList === 'attended' && <AttendedEventsList userId={userId as string} />}
          </View>
        );
      case 'services':
        return <UserServicesList userId={userId as string} />;
      case 'friends':
        return (
          <ScrollView nestedScrollEnabled={true}>
            <FriendsList userId={userId as string} />
            <InterestsList userId={userId as string} />
          </ScrollView>
        );
      case 'subscriptions':
        return <Subscriptions />;
      case 'requests':
        return <ServiceRequestsList userId={userId as string} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-[#001F3F]`}>
        <ActivityIndicator size="large" color="#00BFFF" />
      </View>
    );
  }

  if (!userProfile || !userId) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-[#001F3F]`}>
        <Text style={tw`text-[#00BFFF] text-xl font-bold`}>No user data available</Text>
      </View>
    );
  }

<<<<<<< HEAD
  const handleCreateService = () => {
    navigation.navigate('CreateService' as never);
  };

  const CreateButton: React.FC<{ onPress: () => void; iconName: keyof typeof Ionicons.glyphMap; text: string }> = ({ onPress, iconName, text }) => (
    <TouchableOpacity style={styles.createButton} onPress={onPress}>
      <Ionicons name={iconName} size={24} color="#fff" />
      <Text style={styles.createButtonText}>{text}</Text>
=======
  const ActionButton: React.FC<{ onPress: () => void; iconName: string; text: string; color: string }> = ({ onPress, iconName, text, color }) => (
    <TouchableOpacity
      style={tw`flex-1 flex-row items-center justify-center ${color} py-3 px-2 rounded-full shadow-md mx-1`}
      onPress={onPress}
    >
      <Ionicons name={iconName as any} size={20} color="#FFFFFF" />
      <Text style={tw`text-white text-xs font-bold ml-1`}>{text}</Text>
>>>>>>> a5147af5ba73dc090fe26cb310eb41c7cf6a67ec
    </TouchableOpacity>
  );

  return (
<<<<<<< HEAD
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
        {['events', 'services', 'friends', 'subscriptions', 'requests'].map((tab) => (
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
=======
    <View style={tw`flex-1 bg-[#001F3F]`}>
      <LinearGradient
        colors={['white', '#003366', '#0066CC', '#00BFFF']}
        style={tw`flex-1`}
      >
        <ScrollView 
          style={tw`flex-1`}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <BlurView intensity={80} tint="dark" style={tw`overflow-hidden rounded-3xl mx-4 mt-6 shadow-xl`}>
            <View style={tw`p-6`}>
              <View style={tw`flex-row justify-between items-center mb-4`}>
                <Text style={tw`text-white text-3xl font-bold`}>Profile</Text>
                <View style={tw`flex-row items-center`}>
  <EventRequestBadge />
  <FriendRequestBadge />
                  <InvitationButton />
                </View>
              </View>
              
              <View style={tw`flex-row items-center mb-6`}>
                <Image source={{ uri: userProfile.avatar_url }} style={tw`w-32 h-48 rounded-xl mr-6 border-4 border-[#00BFFF] shadow-lg`} />
                <View style={tw`flex-1`}>
                  <Text style={tw`text-white text-2xl font-bold mb-2`}>{`${userProfile.firstname} ${userProfile.lastname}`}</Text>
                  <Text style={tw`text-[#00BFFF] text-lg mb-2`}>{userProfile.email}</Text>
                  <Text style={tw`text-gray-300 text-sm italic mb-4`}>{userProfile.bio || 'No bio available'}</Text>
                </View>
              </View>
              
              <View style={tw`flex-row justify-between mb-2`}>
                <ActionButton onPress={() => navigation.navigate('EventCreation' as never)} iconName="add-circle-outline" text="New Event" color="bg-[#4CD964]" />
                <ActionButton onPress={() => navigation.navigate('CreateService' as never)} iconName="briefcase-outline" text="New Service" color="bg-[#FF9500]" />
              </View>
              
              <View style={tw`flex-row justify-between mb-2`}>
                <ActionButton onPress={() => navigation.navigate('EditProfile' as never)} iconName="pencil" text="Edit Profile" color="bg-[#FF3B30]" />
                <ActionButton onPress={() => navigation.navigate('ChatList' as never)} iconName="chatbubbles" text="Open Chat" color="bg-[#00BFFF]" />
              </View>
            </View>
          </BlurView>

          <View style={tw`flex-row justify-around mt-6 mb-2`}>
            {['events', 'services', 'friends', 'subscriptions'].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={tw`text-${activeTab === tab ? '[#FF9500]' : 'white'} font-bold capitalize text-lg`}>{tab}</Text>
              </TouchableOpacity>
            ))}
>>>>>>> a5147af5ba73dc090fe26cb310eb41c7cf6a67ec
          </View>

<<<<<<< HEAD
      {showRequests && (
        <View style={styles.requestsOverlay}>
          <RequestsScreen />
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setShowRequests(false)}
=======
          <Animated.View
            style={[
              tw`mx-4 mt-2 p-6 rounded-3xl shadow-2xl bg-[#FFFFFF]/10`,
              {
                opacity: slideAnim,
                transform: [{
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0]
                  })
                }]
              }
            ]}
>>>>>>> a5147af5ba73dc090fe26cb310eb41c7cf6a67ec
          >
            {renderTabContent()}
          </Animated.View>
        </ScrollView>

        
      </LinearGradient>
    </View>
  );
};

<<<<<<< HEAD
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

=======
>>>>>>> a5147af5ba73dc090fe26cb310eb41c7cf6a67ec
export default UserProfileScreen;