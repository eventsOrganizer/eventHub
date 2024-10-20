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
import FriendRequestBadge from './FriendRequestBadge';
import InvitationButton from './InvitationButton';
import { BlurView } from 'expo-blur';
import tw from 'twrnc';

const { width: screenWidth } = Dimensions.get('window');

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
          <>
            <UserEventsList userId={userId as string} />
            <AttendedEventsList userId={userId as string} />
          </>
        );
      case 'friends':
        return (
          <ScrollView nestedScrollEnabled={true}>
            <FriendsList userId={userId as string} />
            <InterestsList userId={userId as string} />
          </ScrollView>
        );
      case 'subscriptions':
        return <Subscriptions />;
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
  const handleCreateEvent = () => {
    navigation.navigate('EventCreation' as never);
  };

  const handleNavigateToServicesSelection = () => {
    navigation.navigate('ServiceSelection', { userId });
  };

  const handleNavigateToUserServices = () => {
    navigation.navigate('UserServicesScreen', { userId });
  };

  const ActionButton: React.FC<{ onPress: () => void; iconName: string; text: string; color: string }> = ({ onPress, iconName, text, color }) => (
    <TouchableOpacity
      style={tw`flex-1 flex-row items-center justify-center ${color} py-3 px-2 rounded-full shadow-md mx-1`}
      onPress={onPress}
    >
      <Ionicons name={iconName as any} size={20} color="#FFFFFF" />
      <Text style={tw`text-white text-xs font-bold ml-1`}>{text}</Text>
    </TouchableOpacity>
  );

  return (
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
          >
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

export default UserProfileScreen;