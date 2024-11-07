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
import FollowerStats from './profile/organizer/FollowerStats';
import Ionicons from 'react-native-vector-icons/Ionicons';

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





const OrganizerProfileScreen: React.FC<{ 
  route: { 
    params: { 
      organizerId: string,
      timestamp?: number 
    } 
  } 
}> = ({ route }) => {
  const { organizerId, timestamp } = route.params;

  const [organizer, setOrganizer] = useState<OrganizerProfile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [showEvents, setShowEvents] = useState(true);
  const [loading, setLoading] = useState(false);

  const { userId: currentUserId } = useUser();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [x,setX]=useState(true)



  useEffect(() => {
    setOrganizer(null);
    setEvents([]);
    setServices([]);
    setShowEvents(true);
    setLoading(false);
    
    fetchOrganizerProfile();
    fetchOrganizerEvents(); // Fetch initial events
  }, [organizerId]);




  
  useEffect(() => {
    if (organizerId) {
      if (showEvents) {
        fetchOrganizerEvents();
      } else {
        fetchOrganizerServices();
      }
    }
  }, [showEvents, organizerId]);

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
      console.log('Fetching events created by organizer:', organizerId);
      const { data: events, error } = await supabase
        .from('event')
        .select(`
          id,
          name,
          details,
          subcategory (
            name,
            category (
              name
            )
          ),
          media (url),
          availability (date, start, end, daysofweek)
        `)
        .eq('user_id', organizerId);
  
      if (error) {
        console.error('Error in fetchOrganizerEvents:', error);
        throw error;
      }
  
      console.log('Events data:', events);
      setEvents(events || []);
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
    <ScrollView style={tw`flex-1 bg-white`}>
      <View style={tw`h-40`}>
      <LinearGradient
  colors={['#007bff', '#0056b3']}
  style={tw`flex-1 justify-center items-center`}
>
  <Text style={tw`text-4xl font-bold text-white`}>{organizer.full_name}</Text>
</LinearGradient>
      </View>
      
      <View style={tw`bg-white -mt-12 rounded-t-3xl p-5`}>
        <View style={tw`flex-row`}>
        <Image 
  source={{ uri: organizer.avatar_url }} 
  style={tw`w-47 h-70 rounded-xl mr-3.6 ml-[3%]`} 
/>
          <View style={tw`flex-1`}>
         
            {/* <Text style={tw`text-gray-600 mb-2`}>{organizer.email}</Text> */}
            <Text style={tw`text-blue-800/80 mb-4`}>{organizer.bio || 'No bio available'}</Text>
            
            {currentUserId ? (
  currentUserId !== organizerId ? (
    <View style={tw`gap-2`}>
      <TouchableOpacity
        style={tw`bg-blue-800 p-3 rounded-lg flex-row items-center justify-center`}
        onPress={() => navigation.navigate('ChatRoom', { userId: currentUserId, organizerId })}
      >
        <Ionicons name="chatbubbles-outline" size={24} color="white" />
        <Text style={tw`text-white font-bold text-center ml-2`}>Message</Text>
      </TouchableOpacity>
      <FriendButton targetUserId={organizerId} />
    </View>
  ) : (
    <Text style={tw`text-gray-600`}>This is your profile</Text>
  )
) : (
  <Text style={tw`text-gray-600`}>Log in to interact with the organizer</Text>
)}
          </View>
          
        </View>
        <View style={tw`mx-2 mt-6 p-4 bg-white rounded-xl border border-blue-200 shadow-sm`}>
  <Text style={tw`text-blue-600 text-lg font-semibold mb-2`}>Description</Text>
  <Text style={tw`text-gray-600 leading-5`}>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  </Text>
</View>

<View style={tw`flex-row items-center justify-between mx-2 mt-[4%]`}>
  <View style={tw`bg-white rounded-xl p-3 shadow-sm border border-blue-200 flex-1 mr-2`}>
    <Text style={tw`text-blue-600 text-sm font-semibold mb-1 text-center`}>
      Subscriptions
    </Text>
    <FollowerStats 
      organizerId={organizerId} 
    />
  </View>
  {currentUserId && currentUserId !== organizerId && (
    <FollowButton 
      targetUserId={organizerId} 
    />
  )}
</View>
           {/* Friends and Interests Container */}
<View style={tw`bg-blue-50 rounded-2xl p-4 mb-6 shadow-md mt-[4%]`}>
  <View style={tw`min-h-[120px]`}>
    <OrganizerInterests organizerId={organizerId} />
    {currentUserId && currentUserId !== organizerId && (
      <>
        <View style={tw`h-[1px] bg-blue-200 my-4`} />
        <FriendsInCommon 
          currentUserId={currentUserId} 
          organizerId={organizerId} 
        />
      </>
    )}
  </View>
</View>
  
        <View style={tw`flex-row justify-around mt-6 border-b border-gray-200 pb-2`}>
          <TouchableOpacity
            style={tw`px-5 py-2 ${showEvents ? 'border-b-2 border-blue-500' : ''}`}
            onPress={() => setShowEvents(true)}
          >
            <Text style={tw`${showEvents ? 'text-blue-500 font-bold' : 'text-gray-600'}`}>Events</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`px-5 py-2 ${!showEvents ? 'border-b-2 border-blue-500' : ''}`}
            onPress={() => setShowEvents(false)}
          >
            <Text style={tw`${!showEvents ? 'text-blue-500 font-bold' : 'text-gray-600'}`}>Services</Text>
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
                <Text style={tw`text-center text-gray-600 mt-4`}>
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