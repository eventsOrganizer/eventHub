import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView, Animated } from 'react-native';
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
import { BlurView } from 'expo-blur';
import tw from 'twrnc';

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
  const [slideAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchRequestCount();
    }
  }, [userId]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  const fetchUserProfile = async () => {
    if (!userId) return;

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
      style={tw`flex-row items-center justify-center ${color} py-2 px-4 rounded-full shadow-md`}
      onPress={onPress}
    >
      <Ionicons name={iconName as any} size={24} color="#FFFFFF" />
      <Text style={tw`text-white text-base font-bold ml-2`}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-[#001F3F]`}>
      <LinearGradient
        colors={['white', '#003366', '#0066CC' , '#00BFFF']}
        style={tw`flex-1`}
      >
        <ScrollView style={tw`flex-1`}>
          <BlurView intensity={80} tint="dark" style={tw`overflow-hidden rounded-3xl mx-4 mt-6 shadow-xl`}>
            <View style={tw`p-6`}>
              <View style={tw`flex-row justify-between items-center mb-4`}>
                <Text style={tw`text-white text-3xl font-bold`}>Profile</Text>
                <TouchableOpacity 
                  style={tw`bg-[#00BFFF] py-2 px-4 rounded-full shadow-md`}
                  onPress={() => navigation.navigate('ChatList' as never)}
                >
                  <Text style={tw`text-white font-bold`}>Open Chat</Text>
                </TouchableOpacity>
                <FriendRequestBadge />
              </View>
              
              <View style={tw`flex-row items-center mb-6`}>
                <Image source={{ uri: userProfile.avatar_url }} style={tw`w-32 h-48 rounded-xl mr-6 border-4 border-[#00BFFF] shadow-lg`} />
                <View style={tw`flex-1`}>
                  <Text style={tw`text-white text-2xl font-bold mb-2`}>{`${userProfile.firstname} ${userProfile.lastname}`}</Text>
                  <Text style={tw`text-[#00BFFF] text-lg mb-2`}>{userProfile.email}</Text>
                  <Text style={tw`text-gray-300 text-sm italic mb-4`}>{userProfile.bio || 'No bio available'}</Text>
                
                </View>
              </View>
              
              <View style={tw`flex-row justify-between mb-4`}>
                
                <ActionButton onPress={() => navigation.navigate('EventCreation' as never)} iconName="add-circle-outline" text="New Event" color="bg-[#4CD964]" />
                <ActionButton onPress={() => navigation.navigate('CreateService' as never)} iconName="briefcase-outline" text="New Service" color="bg-[#FF9500]" />
              </View>
              
              <View style={tw`flex-row justify-between items-center`}>
                <ActionButton onPress={() => setShowRequests(!showRequests)} iconName="notifications" text={`Requests (${requestCount})`} color="bg-[#5856D6]" />
            
                <TouchableOpacity 
                    style={tw`bg-[#FF3B30] py-2 px-4 rounded-full shadow-md self-start`}
                    onPress={() => navigation.navigate('EditProfile' as never)}
                  >
                    <Text style={tw`text-white font-bold`}>Edit Profile</Text>
                  </TouchableOpacity>
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

        {showRequests && (
          <BlurView intensity={100} tint="dark" style={tw`absolute inset-0 justify-center items-center`}>
            <View style={tw`bg-[#001F3F] rounded-3xl p-6 w-11/12 max-h-5/6 shadow-2xl`}>
              <RequestsScreen />
              <TouchableOpacity 
                style={tw`absolute top-4 right-4 bg-[#FF3B30] rounded-full p-3`}
                onPress={() => setShowRequests(false)}
              >
                <Ionicons name="close" size={32} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </BlurView>
        )}
      </LinearGradient>
    </View>
  );
};

export default UserProfileScreen;