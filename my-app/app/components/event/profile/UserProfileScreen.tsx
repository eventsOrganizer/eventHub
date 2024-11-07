import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';
import { useNavigation } from '@react-navigation/native';
import EventRequestBadge from './EventRequestBadge';
import FriendRequestBadge from './FriendRequestBadge';
import InvitationButton from './InvitationButton';
import NotificationComponent from './notification/NotificationComponent';
import { BlurView } from 'expo-blur';
import tw from 'twrnc';
import { useRequestNotifications } from '../../../hooks/useRequestNotifications';
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
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadReceivedRequestsCount, unreadSentActionsCount } = useRequestNotifications(userId);
  const { unreadCount } = useNotifications(userId);

  const fetchData = useCallback(async () => {
    if (userId) {
      await fetchUserProfile();
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const ActionButton: React.FC<{ onPress: () => void; iconName: string; text: string }> = ({ onPress, iconName, text }) => (
    <TouchableOpacity
      style={tw`flex-1 flex-row items-center justify-center bg-white/20 py-3 px-2 rounded-lg shadow-md mx-1`}
      onPress={onPress}
    >
      <Ionicons name={iconName as any} size={20} color="#FFFFFF" />
      <Text style={tw`text-white text-xs font-semibold ml-2`}>{text}</Text>
    </TouchableOpacity>
  );

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
              <ActionButton onPress={() => navigation.navigate('EventCreation')} iconName="add-circle-outline" text="New Event" />
              <ActionButton onPress={() => navigation.navigate('ServiceSelection')} iconName="briefcase-outline" text="New Service" />
            </View>
            
            <View style={tw`flex-row justify-between mb-4`}>
              <ActionButton onPress={() => navigation.navigate('EditProfile')} iconName="pencil" text="Edit Profile" />
              <ActionButton onPress={() => navigation.navigate('ChatList')} iconName="chatbubbles" text="Open Chat" />
            </View>
  
            <View style={tw`flex-row justify-between`}>
              <ActionButton onPress={() => navigation.navigate('TicketScanning')} iconName="qr-code-outline" text="Scan Tickets" />
            </View>
          </View>
        </BlurView>
  
        {/* Services Section */}
        <View style={tw`mx-4 mt-6`}>
          <Text style={tw`text-white text-xl font-bold mb-4`}>Services</Text>
          <View style={tw`bg-white/20 rounded-xl p-4`}>
            <TouchableOpacity
              style={tw`flex-row items-center justify-between mb-4`}
              onPress={() => navigation.navigate('UserServicesScreen', { userId })}
            >
              <View style={tw`flex-row items-center`}>
                <Ionicons name="briefcase" size={24} color="white" />
                <Text style={tw`text-white font-semibold ml-3`}>Manage Your Services</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={tw`flex-row justify-around items-center`}>
              <TouchableOpacity
                style={tw`items-center`}
                onPress={() => navigation.navigate('YourRequests', { userId, mode: 'sent', type: 'service' })}
              >
                <Ionicons name="arrow-up-circle" size={32} color="white" />
                {unreadSentActionsCount > 0 && (
                  <View style={tw`absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 justify-center items-center`}>
                    <Text style={tw`text-white text-xs`}>{unreadSentActionsCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
              
              <Text style={tw`text-white text-sm mx-4`}>Requests</Text>
              
              <TouchableOpacity
                style={tw`items-center`}
                onPress={() => navigation.navigate('YourRequests', { userId, mode: 'received', type: 'service' })}
              >
                <Ionicons name="arrow-down-circle" size={32} color="white" />
                {unreadReceivedRequestsCount > 0 && (
                  <View style={tw`absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 justify-center items-center`}>
                    <Text style={tw`text-white text-xs`}>{unreadReceivedRequestsCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
  
        {/* Events Section */}
        <View style={tw`mx-4 mt-6`}>
          <Text style={tw`text-white text-xl font-bold mb-4`}>Events</Text>
          <View style={tw`bg-white/20 rounded-xl p-4`}>
            <TouchableOpacity
              style={tw`flex-row items-center justify-between mb-4`}
              onPress={() => navigation.navigate('EventsManagement', { userId })}
            >
              <View style={tw`flex-row items-center`}>
                <Ionicons name="calendar" size={24} color="white" />
                <Text style={tw`text-white font-semibold ml-3`}>Manage Your Events</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={tw`flex-row justify-around items-center`}>
              <TouchableOpacity
                style={tw`items-center`}
                onPress={() => navigation.navigate('SentEventRequests')}
              >
                <Ionicons name="arrow-up-circle" size={32} color="white" />
                {unreadSentActionsCount > 0 && (
                  <View style={tw`absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 justify-center items-center`}>
                    <Text style={tw`text-white text-xs`}>{unreadSentActionsCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
  
              <Text style={tw`text-white text-sm mx-4`}>Requests</Text>
  
              <TouchableOpacity
                style={tw`items-center`}
                onPress={() => navigation.navigate('ReceivedEventRequests')}
              >
                <Ionicons name="arrow-down-circle" size={32} color="white" />
                {unreadReceivedRequestsCount > 0 && (
                  <View style={tw`absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 justify-center items-center`}>
                    <Text style={tw`text-white text-xs`}>{unreadReceivedRequestsCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
  
        {/* Social Section */}
        <View style={tw`mx-4 mt-6`}>
          <Text style={tw`text-white text-xl font-bold mb-4`}>Social</Text>
          <TouchableOpacity
            style={tw`bg-[#003791] rounded-3xl p-4 shadow-lg overflow-hidden`}
            onPress={() => navigation.navigate('Social')}
          >
            <BlurView intensity={40} tint="dark" style={tw`p-4 rounded-2xl`}>
              <View style={tw`flex-row items-center justify-between`}>
                <View style={tw`flex-row items-center`}>
                  <Ionicons name="people" size={24} color="white" />
                  <Text style={tw`text-white font-semibold ml-3`}>Social Hub</Text>
                </View>
                <View style={tw`flex-row items-center`}>
                  {unreadReceivedRequestsCount > 0 && (
                    <View style={tw`bg-red-500 rounded-full w-5 h-5 justify-center items-center mr-2`}>
                      <Text style={tw`text-white text-xs`}>{unreadReceivedRequestsCount}</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={24} color="white" />
                </View>
              </View>
            </BlurView>
          </TouchableOpacity>
        </View>
  
        {/* Interests Section */}
        <View style={tw`mx-4 mt-6 mb-4`}>
          <Text style={tw`text-white text-xl font-bold mb-4`}>Interests</Text>
          <TouchableOpacity
            style={tw`bg-white/20 rounded-xl p-4`}
            onPress={() => navigation.navigate('InterestsList', { userId })}
          >
            <View style={tw`flex-row items-center justify-between`}>
              <View style={tw`flex-row items-center`}>
                <Ionicons name="heart" size={24} color="white" />
                <Text style={tw`text-white font-semibold ml-3`}>Manage Your Interests</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default UserProfileScreen;