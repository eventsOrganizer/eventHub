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

  // Navigate to UserServicesScreen when the services tab is selected
  useEffect(() => {
    if (activeTab === 'services') {
      navigation.navigate('UserServicesScreen', { userId });
    }
  }, [activeTab, navigation, userId]);

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
                <ActionButton onPress={() => navigation.navigate('ServiceSelection' as never)} iconName="briefcase-outline" text="New Service" color="bg-[#FF9500]" />
              </View>
              
              <View style={tw`flex-row justify-between mb-2`}>
                <ActionButton onPress={() => navigation.navigate('EditProfile' as never)} iconName="pencil" text="Edit Profile" color="bg-[#FF3B30]" />
                <ActionButton onPress={() => navigation.navigate('ChatList' as never)} iconName="chatbubbles" text="Open Chat" color="bg-[#00BFFF]" />
              </View>
            </View>
          </BlurView>

          <View style={tw`flex-row justify-around mt-6 mb-4`}>
            <TouchableOpacity
              style={tw`bg-[#FF9500] py-3 px-6 rounded-full shadow-md`}
              onPress={() => navigation.navigate('UserServicesScreen', { userId })}
            >
              <Text style={tw`text-white font-bold`}>Services</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-[#4CD964] py-3 px-6 rounded-full shadow-md`}
              onPress={() => navigation.navigate('YourRequests', { userId })}
            >
              <Text style={tw`text-white font-bold`}>Service Requests</Text>
            </TouchableOpacity>
          </View>

          <View style={tw`flex-row justify-around mt-6 mb-2`}>
            {['events', 'friends', 'subscriptions'].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={tw`text-${activeTab === tab ? '[#FF9500]' : 'white'} font-bold capitalize text-lg`}>{tab}</Text>
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
          </Animated.View>
        </ScrollView>

        
      </LinearGradient>
    </View>
  );
};

export default UserProfileScreen;