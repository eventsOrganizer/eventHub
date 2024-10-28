import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';
import { useNavigation } from '@react-navigation/native';
import EventRequestBadge from './EventRequestBadge';
import UserEventsList from './UserEventList';
import AttendedEventsList from './AttendedEventList';
import FriendsList from './FriendsList';
import InterestsList from './InterestsList';
import Subscriptions from './Subscriptions';
import FriendRequestBadge from './FriendRequestBadge';
import InvitationButton from './InvitationButton';
import NotificationComponent from './notification/NotificationComponent';
import { BlurView } from 'expo-blur';
import tw from 'twrnc';
import { useRequestNotifications } from '../../../hooks/useRequestNotifications';
import TicketManagement from '../Ticketing/TicketManagement';
import { useNotifications } from '../../../hooks/useNotifications';
import NotificationList from '../../Notifications/NotificationList';

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
  const navigation = useNavigation<any>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('events');
  const [loading, setLoading] = useState(true);
  const [slideAnim] = useState(new Animated.Value(0));
  const [activeEventList, setActiveEventList] = useState<'your' | 'attended'>('your');
  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadReceivedRequestsCount, unreadSentActionsCount } = useRequestNotifications(userId);


  const fetchData = useCallback(async () => {
    if (userId) {
      await fetchUserProfile();
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

  const { unreadCount } = useNotifications(userId);

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'events':
        return (
          <View style={tw`space-y-6`}>
            <View style={tw`flex-row justify-around mb-4`}>
              <TouchableOpacity
                style={tw`bg-[#B19CD9] py-2 px-4 rounded-lg ${activeEventList === 'your' ? 'opacity-100' : 'opacity-50'}`}
                onPress={() => setActiveEventList('your')}
              >
                <Text style={tw`text-white font-bold`}>Your Events</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-[#B19CD9] py-2 px-4 rounded-lg ${activeEventList === 'attended' ? 'opacity-100' : 'opacity-50'}`}
                onPress={() => setActiveEventList('attended')}
              >
                <Text style={tw`text-white font-bold`}>Attended Events</Text>
              </TouchableOpacity>
            </View>
            {activeEventList === 'your' && <UserEventsList userId={userId as string} />}
            {activeEventList === 'attended' && <AttendedEventsList userId={userId as string} />}
          </View>
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
      case 'services':
        return <UserServicesList userId={userId as string} />;
        case 'tickets':
          return <TicketManagement />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (activeTab === 'services') {
      navigation.navigate('UserServicesScreen' as never, { userId } as never);
    }
  }, [activeTab, navigation, userId]);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-[#FF5F00]`}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (!userProfile || !userId) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-[#FF5F00]`}>
        <Text style={tw`text-white text-xl font-bold`}>No user data available</Text>
      </View>
    );
  }

  const ActionButton: React.FC<{ onPress: () => void; iconName: string; text: string }> = ({ onPress, iconName, text }) => (
    <TouchableOpacity
      style={tw`flex-1 flex-row items-center justify-center bg-white/20 py-3 px-2 rounded-lg shadow-md mx-1`}
      onPress={onPress}
    >
      <Ionicons name={iconName as any} size={20} color="#FFFFFF" />
      <Text style={tw`text-white text-xs font-semibold ml-2`}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#1E3A8A', '#3B82F6', '#93C5FD']}
      style={tw`flex-1`}
    >
      {showNotifications && (
        <View style={tw`absolute top-20 right-4 z-10 w-80 max-h-96 bg-white rounded-lg shadow-lg`}>
          <NotificationList userId={userId} />
        </View>
      )}
      <ScrollView 
        style={tw`flex-1`}
        contentContainerStyle={tw`pb-10`}
      >
        <BlurView intensity={80} tint="dark" style={tw`overflow-hidden rounded-3xl mx-4 mt-6 shadow-xl`}>
          <View style={tw`p-6`}>
            <View style={tw`flex-row justify-between items-center mb-6`}>
              <Text style={tw`text-white text-2xl font-bold`}>Profile</Text>
              <View style={tw`flex-row items-center`}>
                <TouchableOpacity 
                  onPress={() => setShowNotifications(!showNotifications)}
                  style={tw`relative mr-2`}
                >
                  <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
                  {unreadCount > 0 && (
                    <View style={tw`absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 justify-center items-center`}>
                      <Text style={tw`text-white text-xs`}>{unreadCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <EventRequestBadge />
                <FriendRequestBadge />
                <InvitationButton />
              </View>
            </View>
            
            <View style={tw`flex-row items-center mb-6`}>
              <Image source={{ uri: userProfile.avatar_url }} style={tw`w-32 h-48 rounded-xl mr-4 border-2 border-white`} />
              <View style={tw`flex-1`}>
                <Text style={tw`text-white text-xl font-bold mb-1`}>{`${userProfile.firstname} ${userProfile.lastname}`}</Text>
                <Text style={tw`text-blue-200 text-sm mb-2`}>{userProfile.email}</Text>
                <Text style={tw`text-blue-100 text-xs italic`}>{userProfile.bio || 'No bio available'}</Text>
              </View>
            </View>
            
            <View style={tw`flex-row justify-between mb-4`}>
              <ActionButton onPress={() => navigation.navigate('EventCreation' as never)} iconName="add-circle-outline" text="New Event" />
              <ActionButton onPress={() => navigation.navigate('ServiceSelection' as never)} iconName="briefcase-outline" text="New Service" />
            </View>
            
            <View style={tw`flex-row justify-between mb-4`}>
              <ActionButton onPress={() => navigation.navigate('EditProfile' as never)} iconName="pencil" text="Edit Profile" />
              <ActionButton onPress={() => navigation.navigate('ChatList' as never)} iconName="chatbubbles" text="Open Chat" />
            </View>

            <View style={tw`flex-row justify-between`}>
              <ActionButton onPress={() => navigation.navigate('TicketScanning' as never)} iconName="qr-code-outline" text="Scan Tickets" />
            </View>
          </View>
        </BlurView>

        <View style={tw`flex-row justify-center mt-6 mb-4`}>
    <TouchableOpacity
      style={tw`bg-white/20 py-2 px-3 rounded-lg shadow-md mx-1 max-w-[110]`}
      onPress={() => navigation.navigate('UserServicesScreen' as never, { userId } as never)}
    >
      <Text style={tw`text-white font-semibold text-center text-sm`}>Services</Text>
    </TouchableOpacity>
    
    <TouchableOpacity
      style={tw`bg-white/20 py-2 px-3 rounded-lg shadow-md mx-1 max-w-[110] flex-row items-center`}
      onPress={() => navigation.navigate('YourRequests', { userId, mode: 'sent' })}
    >
      <Text style={tw`text-white font-semibold text-center text-sm`}>Sent Requests</Text>
      {unreadSentActionsCount > 0 && (
        <View style={tw`ml-1 bg-red-500 rounded-full w-5 h-5 justify-center items-center`}>
          <Text style={tw`text-white text-xs`}>{unreadSentActionsCount}</Text>
        </View>
      )}
    </TouchableOpacity>
    
    <TouchableOpacity
      style={tw`bg-white/20 py-2 px-3 rounded-lg shadow-md mx-1 max-w-[110] flex-row items-center`}
      onPress={() => navigation.navigate('YourRequests', { userId, mode: 'received' })}
    >
      <Text style={tw`text-white font-semibold text-center text-sm`}>Received Requests</Text>
      {unreadReceivedRequestsCount > 0 && (
        <View style={tw`ml-1 bg-red-500 rounded-full w-5 h-5 justify-center items-center`}>
          <Text style={tw`text-white text-xs`}>{unreadReceivedRequestsCount}</Text>
        </View>
      )}
    </TouchableOpacity>
        </View>

        <View style={tw`flex-row justify-around mt-6 mb-2`}>
  {['events', 'friends', 'subscriptions', 'albums', 'tickets'].map((tab) => (
    <TouchableOpacity
      key={tab}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={tw`text-${activeTab === tab ? 'white' : 'blue-200'} font-semibold capitalize text-lg`}>{tab}</Text>
    </TouchableOpacity>
  ))}
</View>

        <Animated.View
          style={[
            tw`mx-4 mt-2 p-6 rounded-3xl shadow-2xl bg-white/10`,
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
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

export default UserProfileScreen;