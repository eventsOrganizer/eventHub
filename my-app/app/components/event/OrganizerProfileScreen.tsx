import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import YourEventCard from '../event/YourEventCard';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../../UserContext';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import FriendButton from '../../components/event/profile/FriendButton';
import FollowButton from '../../components/event/profile/FollowButton';
import FriendsInCommon from '../../components/event/profile/organizer/FriendsInCommon';
import OrganizerInterests from '../../components/event/profile/organizer/OrganizerInterests';
import tw from 'twrnc';


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
  type: { name: string };
  serviceType: 'Personal' | 'Local' | 'Material';
  priceperhour: number;
  details: string;
  imageUrl?: string;
  media?: { url: string }[];
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
    try {
      const { data, error } = await supabase
        .from('event')
        .select(`
          *,
          subcategory (name, category (name)),
          media (url),
          availability (date, start, end, daysofweek)
        `)
        .eq('user_id', organizerId);

      if (error) throw error;

      setEvents(data.filter(event => event.availability && event.availability.length > 0));
    } catch (error) {
      console.error('Error fetching organizer events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizerServices = async () => {
    setLoading(true);
    try {
      const [personalData, localData, materialData] = await Promise.all([
        supabase
          .from('personal')
          .select('id, name, type:subcategory(name), priceperhour, details, media(url)')
          .eq('user_id', organizerId),
        supabase
          .from('local')
          .select('id, name, type:subcategory(name), priceperhour, details, media(url)')
          .eq('user_id', organizerId),
        supabase
          .from('material')
          .select('id, name, type:subcategory(name), priceperhour, details, media(url)')
          .eq('user_id', organizerId)
      ]);
  
      const allServices: Service[] = [
        ...(personalData.data || []).map(s => ({ ...s, serviceType: 'Personal' as const, imageUrl: s.media?.[0]?.url })),
        ...(localData.data || []).map(s => ({ ...s, serviceType: 'Local' as const, imageUrl: s.media?.[0]?.url })),
        ...(materialData.data || []).map(s => ({ ...s, serviceType: 'Material' as const, imageUrl: s.media?.[0]?.url }))
      ];
  
      setServices(allServices);
    } catch (error) {
      console.error('Error fetching organizer services:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Event | Service }) => {
    if ('availability' in item) {
      return (
        <TouchableOpacity 
          onPress={() => navigation.navigate('EventDetails', { eventId: item.id })} 
          style={tw`mb-4`}
        >
          <YourEventCard event={item} onPress={() => navigation.navigate('EventDetails', { eventId: item.id })} />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity 
          style={tw`flex-row bg-white rounded-xl mb-4 overflow-hidden`}
          onPress={() => navigation.navigate(
            item.serviceType === 'Personal' ? 'PersonalDetail' :
            item.serviceType === 'Local' ? 'LocalServiceDetails' :
            'MaterialDetail',
            { serviceId: item.id }
          )}
        >
          <Image 
            source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} 
            style={tw`w-25 h-25`} 
          />
          <View style={tw`flex-1 p-3`}>
            <Text style={tw`text-lg font-bold mb-1`}>{item.name}</Text>
            <Text style={tw`text-gray-600 mb-1`}>{item.type.name}</Text>
            <Text style={tw`text-green-500 mb-1`}>${item.priceperhour}/hour</Text>
            <Text style={tw`text-gray-800`} numberOfLines={2}>{item.details}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  if (!organizer) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-900`}>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-gray-900`}>
      <View style={tw`h-40`}>
        <LinearGradient
          colors={['#FFA500', '#FFD700']}
          style={tw`flex-1`}
        />
      </View>
      
      <View style={tw`bg-gray-800 -mt-12 rounded-t-3xl p-5`}>
        <View style={tw`flex-row`}>
          <Image 
            source={{ uri: organizer.avatar_url }} 
            style={tw`w-30 h-48 rounded-xl mr-4`} 
          />
          <View style={tw`flex-1`}>
            <Text style={tw`text-2xl font-bold text-white mb-1`}>{organizer.full_name}</Text>
            <Text style={tw`text-gray-400 mb-2`}>{organizer.email}</Text>
            <Text style={tw`text-white/80 mb-4`}>{organizer.bio || 'No bio available'}</Text>
            
            {currentUserId ? (
              currentUserId !== organizerId ? (
                <View style={tw`gap-2`}>
                  <TouchableOpacity
                    style={tw`bg-orange-500 p-3 rounded-lg`}
                    onPress={() => navigation.navigate('ChatRoom', { userId: currentUserId, organizerId })}
                  >
                    <Text style={tw`text-white font-bold text-center`}>Chat with Organizer</Text>
                  </TouchableOpacity>
                  <FriendButton targetUserId={organizerId} />
                  <FollowButton targetUserId={organizerId} />
                </View>
              ) : (
                <Text style={tw`text-gray-400`}>This is your profile</Text>
              )
            ) : (
              <Text style={tw`text-gray-400`}>Log in to interact with the organizer</Text>
            )}
          </View>
        </View>

        <FriendsInCommon currentUserId={currentUserId!} organizerId={organizerId} />
        <OrganizerInterests organizerId={organizerId} />

        <View style={tw`flex-row justify-around mt-6 border-b border-gray-700 pb-2`}>
          <TouchableOpacity
            style={tw`px-5 py-2 ${showEvents ? 'border-b-2 border-orange-500' : ''}`}
            onPress={() => setShowEvents(true)}
          >
            <Text style={tw`${showEvents ? 'text-orange-500 font-bold' : 'text-gray-400'}`}>Events</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`px-5 py-2 ${!showEvents ? 'border-b-2 border-orange-500' : ''}`}
            onPress={() => setShowEvents(false)}
          >
            <Text style={tw`${!showEvents ? 'text-orange-500 font-bold' : 'text-gray-400'}`}>Services</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FFA500" style={tw`py-8`} />
        ) : (
          <View style={tw`py-4`}>
            <FlatList
              data={showEvents ? events : services}
              renderItem={renderItem}
              keyExtractor={(item) => `${showEvents ? 'event' : 'service'}-${item.id}`}
              ListEmptyComponent={
                <Text style={tw`text-center text-gray-400 mt-4`}>
                  {showEvents ? 'No events found' : 'No services found'}
                </Text>
              }
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default OrganizerProfileScreen;