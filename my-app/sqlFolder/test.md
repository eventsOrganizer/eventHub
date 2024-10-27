import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import tw from 'twrnc';

interface NavBarProps {
  selectedFilter: string | null;
  setSelectedFilter: (value: string | null) => void;
  onSearch: (searchTerm: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ selectedFilter, setSelectedFilter, onSearch }) => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const { width } = Dimensions.get('window');

  const createCurve = () => {
    const height = 20;
    return `M0,${height} C${width / 4},0 ${width * 3 / 4},0 ${width},${height} L${width},0 L0,0 Z`;
  };

  return (
    <View style={tw`relative`}>
      <LinearGradient
        colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)', 'transparent']}
        style={tw`pt-4 px-3 pb-8`}
      >
        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-1 flex-row items-center bg-white bg-opacity-20 rounded-full px-3 py-2 mr-2`}>
            <Ionicons name="search" size={20} color="#1a2a4a" style={tw`mr-2`} />
            <TextInput
              style={tw`flex-1 text-[#1a2a4a] text-base`}
              placeholder="Search events and services..."
              placeholderTextColor="#4a5a7a"
              value={searchTerm}
              onChangeText={setSearchTerm}
              onSubmitEditing={() => onSearch(searchTerm)}
            />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('UserProfile' as never)} style={tw`p-2`}>
            <Ionicons name="person-outline" size={24} color="#1a2a4a" />
          </TouchableOpacity>
          <TouchableOpacity style={tw`p-2`}>
            <Ionicons name="notifications" size={24} color="#1a2a4a" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={tw`p-2`}
            onPress={() => navigation.navigate('ChatList' as never)}
          >
            <Ionicons name="chatbubbles-outline" size={24} color="#1a2a4a" />
          </TouchableOpacity>
          <View style={tw`w-30`}>
            <RNPickerSelect
              onValueChange={(value) => setSelectedFilter(value)}
              items={[
                { label: 'All', value: 'all' },
                { label: 'This Week', value: 'this_week' },
                { label: 'This Month', value: 'this_month' },
              ]}
              style={{
                inputIOS: tw`text-[#1a2a4a] text-base pr-8`,
                inputAndroid: tw`text-[#1a2a4a] text-base pr-8`,
              }}
              value={selectedFilter}
              Icon={() => <Ionicons name="chevron-down" size={20} color="#1a2a4a" style={tw`absolute right-0 top-2`} />}
            />
          </View>
        </View>
      </LinearGradient>
      <Svg height="20" width={width} style={tw`absolute bottom-0`}>
        <Path d={createCurve()} fill="rgba(255,255,255,0.8)" />
      </Svg>
    </View>
  );
};

export default NavBar;











/////////////////



import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import tw from 'twrnc';

interface NavBarProps {
  selectedFilter: string | null;
  setSelectedFilter: (value: string | null) => void;
  onSearch: (searchTerm: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ selectedFilter, setSelectedFilter, onSearch }) => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <LinearGradient
      colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)', 'transparent']}
      style={tw`py-4 px-3 rounded-b-lg`}
    >
      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`flex-1 flex-row items-center bg-white bg-opacity-20 rounded-full px-3 py-2 mr-2`}>
          <Ionicons name="search" size={20} color="#1a2a4a" style={tw`mr-2`} />
          <TextInput
            style={tw`flex-1 text-[#1a2a4a] text-base`}
            placeholder="Search events and services..."
            placeholderTextColor="#4a5a7a"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={() => onSearch(searchTerm)}
          />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile' as never)} style={tw`p-2`}>
          <Ionicons name="person-outline" size={24} color="#1a2a4a" />
        </TouchableOpacity>
        <TouchableOpacity style={tw`p-2`}>
          <Ionicons name="notifications" size={24} color="#1a2a4a" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={tw`p-2`}
          onPress={() => navigation.navigate('ChatList' as never)}
        >
          <Ionicons name="chatbubbles-outline" size={24} color="#1a2a4a" />
        </TouchableOpacity>
        <View style={tw`w-30`}>
          <RNPickerSelect
            onValueChange={(value) => setSelectedFilter(value)}
            items={[
              { label: 'All', value: 'all' },
              { label: 'This Week', value: 'this_week' },
              { label: 'This Month', value: 'this_month' },
            ]}
            style={{
              inputIOS: tw`text-[#1a2a4a] text-base pr-8`,
              inputAndroid: tw`text-[#1a2a4a] text-base pr-8`,
            }}
            value={selectedFilter}
            Icon={() => <Ionicons name="chevron-down" size={20} color="#1a2a4a" style={tw`absolute right-0 top-2`} />}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

export default NavBar;





//////////////


import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../services/supabaseClient';
import tw from 'twrnc';

interface FilterAdvancedProps {
  onEventsLoaded: (events: any[]) => void;
}

const FilterAdvanced: React.FC<FilterAdvancedProps> = ({ onEventsLoaded }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchFilteredEvents();
  }, [selectedCategory, selectedSubcategory]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('category')
      .select('id, name')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return;
    }

    setCategories([{ id: null, name: 'All' }, ...data]);
  };

  const fetchSubcategories = async (categoryId: number) => {
    const { data, error } = await supabase
      .from('subcategory')
      .select('id, name')
      .eq('category_id', categoryId)
      .order('name');

    if (error) {
      console.error('Error fetching subcategories:', error);
      return;
    }

    setSubcategories([{ id: null, name: 'All' }, ...data]);
  };

  const fetchFilteredEvents = async () => {
    let query = supabase
      .from('event')
      .select(`
        *,
        subcategory!inner (id, name, category_id),
        location!inner (id, longitude, latitude),
        availability!inner (id, start, end, daysofweek, date),
        media (url),
        user:user_id (email),
        event_has_user!inner (user_id)
      `);

    if (selectedCategory) {
      query = query.eq('subcategory.category_id', selectedCategory);
    }

    if (selectedSubcategory) {
      query = query.eq('subcategory_id', selectedSubcategory);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching filtered events:', error);
      return;
    }

    onEventsLoaded(data || []);
  };

  return (
    <View style={tw`p-4 bg-white`}>
      <Text style={tw`text-lg font-bold mb-2`}>Filter Events</Text>
      <View style={tw`mb-4`}>
        <Text style={tw`mb-1`}>Category</Text>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => {
            setSelectedCategory(itemValue);
            setSelectedSubcategory(null);
          }}
          style={tw`border border-gray-300 rounded`}
        >
          {categories.map((category) => (
            <Picker.Item key={category.id} label={category.name} value={category.id} />
          ))}
        </Picker>
      </View>
      {selectedCategory !== null && (
        <View style={tw`mb-4`}>
          <Text style={tw`mb-1`}>Subcategory</Text>
          <Picker
            selectedValue={selectedSubcategory}
            onValueChange={(itemValue) => setSelectedSubcategory(itemValue)}
            style={tw`border border-gray-300 rounded`}
          >
            {subcategories.map((subcategory) => (
              <Picker.Item key={subcategory.id} label={subcategory.name} value={subcategory.id} />
            ))}
          </Picker>
        </View>
      )}
    </View>
  );
};

export default FilterAdvanced;







/////////////////////////


import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { supabase } from '../services/supabaseClient';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import EventMap from '../components/map/EventMap';
import AttendeesSection from '../components/event/AttendeesSection';
import PhotosSection from '../components/event/PhotosSection';
import CommentsSection from '../components/event/CommentsSection';
import styles from '../components/event/styles/eventDetailsStyles';
import JoinEventButton from '../components/event/JoinEventButton';
import UserAvatar from '../components/event/UserAvatar';
import EventLike from '../components/event/EventLike';
import EventReview from '../components/event/EventReview';

interface EventDetails {
  id: number;
  name: string;
  type: string;
  details: string;
  privacy: boolean;
  subcategory: {
    category: {
      name: string;
    };
    name: string;
  };
  media: { url: string }[];
  availability: Array<{
    date: string;
    start: string;
    end: string;
    daysofweek: string;
  }>;
  location: Array<{
    longitude: number;
    latitude: number;
  }>;
  user: {
    email: string;
    avatar_url?: string;
  } | null;
  user_id: string;
  address: string;
}

const EventDetailsScreen: React.FC<{ route: { params: { eventId: number } }, navigation: any }> = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('Loading address...');
  const [attendeesRefreshTrigger, setAttendeesRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const { data: eventData, error: eventError } = await supabase
          .from('event')
          .select(`
            *,
            subcategory (
              name,
              category (
                name
              )
            ),
            location (longitude, latitude),
            availability (date, start, end, daysofweek),
            media (url)
          `)
          .eq('id', eventId)
          .single();
    
        console.log('Event Data:', eventData);
    
        if (eventError) {
          console.error('Error fetching event details:', eventError);
          return;
        }
    
        if (eventData) {
          const { data: userData, error: userError } = await supabase
            .from('user')
            .select('email')
            .eq('id', eventData.user_id)
            .single();
    
          console.log('User Data:', userData);
    
          if (userError) {
            console.error('Error fetching user details:', userError);
          } else {
            eventData.user = {
              ...eventData.user,
              email: userData.email
            };
          }
    
          const { data: mediaData, error: mediaError } = await supabase
            .from('media')
            .select('url')
            .eq('user_id', eventData.user_id)
            .single();
    
          console.log('Media Data:', mediaData);
    
          if (mediaError) {
            console.error('Error fetching user media:', mediaError);
          } else {
            eventData.user = {
              ...eventData.user,
              avatar_url: mediaData?.url || 'https://via.placeholder.com/150'
            };
          }
        }
    
        console.log('Final Event Data:', eventData);
        setEventDetails(eventData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleJoinSuccess = () => {
    setAttendeesRefreshTrigger(prev => prev + 1);
  };

  const handleLeaveSuccess = () => {
    setAttendeesRefreshTrigger(prev => prev + 1);
  };

  if (!eventDetails) {
    return <View style={styles.loadingContainer}><Text style={styles.loadingText}>Loading...</Text></View>;
  }

  const openMap = () => {
    const latitude = eventDetails.location[0]?.latitude || 0;
    const longitude = eventDetails.location[0]?.longitude || 0;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <LinearGradient colors={['#000000', '#808080']} style={styles.container}>
      <ScrollView>
        <LinearGradient
          colors={['#FF8C00', '#FFA500']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientHeader}
        >
          <Text style={styles.eventName}>{eventDetails.name}</Text>
          <JoinEventButton
            eventId={eventDetails.id}
            privacy={eventDetails.privacy}
            organizerId={eventDetails.user_id}
            onJoinSuccess={handleJoinSuccess}
            onLeaveSuccess={handleLeaveSuccess}
          />
          <View style={styles.organizerContainer}>
  <UserAvatar userId={eventDetails.user_id} size={60} />
  <View>
    <Text style={styles.organizerLabel}>Organizer:</Text>
    <Text style={styles.organizerEmail}>{eventDetails.user?.email || 'Unknown'}</Text>
  </View>
</View>
        </LinearGradient>

        <Image source={{ uri: eventDetails.media[0]?.url }} style={styles.eventImage} />

        <View style={styles.contentContainer}>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={24} color="#FF8C00" />
              <Text style={styles.infoText}>
                {eventDetails.availability[0]?.date || 'N/A'} | {eventDetails.availability[0]?.start || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="pricetag" size={24} color="#FF8C00" />
              <Text style={styles.infoText}>
                {eventDetails.subcategory.category.name} - {eventDetails.subcategory.name}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="business" size={24} color="#FF8C00" />
              <Text style={styles.infoText}>{eventDetails.type}</Text>
            </View>
          </View>

          <View style={styles.mapSection}>
            <View style={styles.mapInfo}>
              <Text style={styles.mapInfoTitle}>Address:</Text>
              <Text style={styles.mapInfoText}>{address}</Text>
              <Text style={styles.mapInfoTitle}>Distance:</Text>
              <Text style={styles.mapInfoText}>{distance ? `${distance.toFixed(2)} km` : 'Calculating...'}</Text>
              <TouchableOpacity style={styles.openMapButton} onPress={openMap}>
                <Text style={styles.openMapButtonText}>Open in Google Maps</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.mapContainer}>
              <EventMap
                eventLatitude={eventDetails.location[0]?.latitude || 0}
                eventLongitude={eventDetails.location[0]?.longitude || 0}
                onDistanceCalculated={setDistance}
                onAddressFound={setAddress}
              />
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Event Details</Text>
            <Text style={styles.details}>{eventDetails.details}</Text>
          </View>

          <View style={styles.sectionsContainer}>
            <AttendeesSection eventId={eventId} refreshTrigger={attendeesRefreshTrigger} />
            <PhotosSection eventId={eventId} />
            <CommentsSection eventId={eventId} />
          </View>
        </View>
        
        <EventLike eventId={eventId} />
        <EventReview eventId={eventId} />
    </ScrollView>
    </LinearGradient>
  );
};

export default EventDetailsScreen;


ehre is the event detaisl screen so rewrite it whoel and updated withotu changign naythign in its core fucntionalities or anythign that is already set you will only add the the update to incldue this system !!! 



//////////////////////////////////////////


import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, AppState, FlatList, Modal, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { supabase } from '../../../services/supabaseClient';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import { useUser } from '../../../UserContext';

const DAILY_API_KEY = '731a44ab06649fabe8300c0f5d89fd8721f34d5f685549bc92a4b44b33f9401c';
const DAILY_API_URL = 'https://api.daily.co/v1';

interface Participant {
  id: string;
  user_id: string;
  user_name: string;
  join_time: string;
}

const VideoCall = ({ route, navigation }: { route: any; navigation: any }) => {
  const { roomUrl, isCreator, roomId } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const webViewRef = useRef<WebView>(null);
  const { userId } = useUser();
  const appState = useRef(AppState.currentState);

  const fetchParticipants = useCallback(async () => {
    try {
      const response = await fetch(`${DAILY_API_URL}/presence`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DAILY_API_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const roomName = roomUrl.split('/').pop();
      const roomParticipants = data[roomName] || [];

      setParticipants(roomParticipants.map((p: any) => ({
        id: p.id,
        user_id: p.userId,
        user_name: p.userName,
        join_time: p.joinTime
      })));
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  }, [roomUrl]);

  useEffect(() => {
    console.log('VideoCall component mounted');
    checkAndRequestPermissions();
    joinRoom();
    fetchParticipants();

    const heartbeatInterval = setInterval(sendHeartbeat, 3000);
    const participantsFetchInterval = setInterval(fetchParticipants, 15000);
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    navigation.addListener('beforeRemove', (e: any) => {
      e.preventDefault();
      leaveRoom().then(() => navigation.dispatch(e.data.action));
    });

    return () => {
      console.log('VideoCall component will unmount');
      clearInterval(heartbeatInterval);
      clearInterval(participantsFetchInterval);
      appStateSubscription.remove();
      leaveRoom();
    };
  }, [isCreator, roomId, userId, navigation, fetchParticipants]);

  const sendHeartbeat = async () => {
    try {
      const { error } = await supabase
        .from('room_participants')
        .update({ last_heartbeat: new Date().toISOString() })
        .match({ room_id: roomId, user_id: userId });

      if (error) console.error('Error sending heartbeat:', error);
    } catch (error) {
      console.error('Exception when sending heartbeat:', error);
    }
  };

  const handleAppStateChange = async (nextAppState: string) => {
    if (appState.current.match(/active|foreground/) && nextAppState === 'background') {
      await leaveRoom();
    } else if (appState.current === 'background' && nextAppState === 'active') {
      await joinRoom();
    }
    appState.current = nextAppState;
  };

  const checkAndRequestPermissions = async () => {
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    const { status: audioStatus } = await Audio.requestPermissionsAsync();
  
    if (cameraStatus === 'granted' && audioStatus === 'granted') {
      setPermissionsGranted(true);
    } else {
      setError('Camera and microphone permissions are required for video calls.');
    }
  };

  const joinRoom = async () => {
    try {
      const { error } = await supabase
        .from('room_participants')
        .upsert({ room_id: roomId, user_id: userId, is_active: true, last_heartbeat: new Date().toISOString() },
                 { onConflict: ['room_id', 'user_id'] });
      
      if (error) console.error('Error joining room:', error);
      
      if (isCreator) {
        const { error: roomError } = await supabase
          .from('videoroom')
          .update({ is_connected: true })
          .eq('id', roomId);
        
        if (roomError) console.error('Error updating room connection status:', roomError);
      }
    } catch (error) {
      console.error('Exception when joining room:', error);
    }
  };

  const leaveRoom = async () => {
    try {
      const { error } = await supabase
        .from('room_participants')
        .update({ is_active: false, left_at: new Date().toISOString() })
        .match({ room_id: roomId, user_id: userId });

      if (error) console.error('Error leaving room:', error);

      if (isCreator) {
        const { error: roomError } = await supabase
          .from('videoroom')
          .update({ is_connected: false })
          .eq('id', roomId);
        
        if (roomError) console.error('Error updating room connection status:', roomError);
      }
    } catch (error) {
      console.error('Exception when leaving room:', error);
    }
  };

  const kickParticipant = async (participantId: string) => {
    if (!isCreator) {
      Alert.alert('Error', 'Only the room creator can kick participants.');
      return;
    }

    try {
      const roomName = roomUrl.split('/').pop();
      const response = await fetch(`${DAILY_API_URL}/rooms/${roomName}/eject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DAILY_API_KEY}`
        },
        body: JSON.stringify({ ids: [participantId] })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Kick response:', data);

      // Update local state
      setParticipants(prevParticipants => prevParticipants.filter(p => p.id !== participantId));

      Alert.alert('Success', 'Participant has been kicked from the room.');
    } catch (error) {
      console.error('Error kicking participant:', error);
      Alert.alert('Error', `Failed to kick participant: ${error.message}`);
    }
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
    fetchParticipants();
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    setError('Failed to load the video call. Please try again.');
    setIsLoading(false);
  };

  const reloadWebView = () => {
    setIsLoading(true);
    setError(null);
    webViewRef.current?.reload();
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.action === 'participantJoined' || data.action === 'participantLeft') {
        fetchParticipants();
      }
    } catch (error) {
      console.error('Error handling WebView message:', error);
    }
  };

  const injectedJavaScript = `
    (function() {
      if (window.call) {
        window.call.on('participant-joined', () => {
          window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'participantJoined' }));
        });
        window.call.on('participant-left', () => {
          window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'participantLeft' }));
        });
      } else {
        console.error('Daily.co call object not found');
      }

      navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    })();
    true;
  `;

  return (
    <View style={styles.container}>
      {isLoading && <Text style={styles.loadingText}>Loading video call...</Text>}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.reloadButton} onPress={reloadWebView}>
            <Text style={styles.reloadButtonText}>Reload</Text>
          </TouchableOpacity>
        </View>
      )}
      {permissionsGranted && (
        <>
          <WebView
            ref={webViewRef}
            source={{ uri: roomUrl }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback={true}
            onLoadEnd={handleLoadEnd}
            onError={handleError}
            injectedJavaScript={injectedJavaScript}
            onMessage={handleMessage}
          />
          {isCreator && (
            <TouchableOpacity 
              style={styles.participantsButton} 
              onPress={() => setShowParticipants(true)}
            >
              <Text style={styles.participantsButtonText}>Manage Participants</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      <Modal visible={showParticipants} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Room Participants</Text>
          <FlatList
            data={participants}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.participantItem}>
                <Text>{item.user_name || item.user_id}</Text>
                {isCreator && item.user_id !== userId && (
                  <TouchableOpacity 
                    onPress={() => kickParticipant(item.id)}
                    style={styles.kickButton}
                  >
                    <Text style={styles.kickButtonText}>Kick</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setShowParticipants(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    margin: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    margin: 10,
    fontSize: 16,
    color: 'red',
  },
  reloadButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  reloadButtonText: {
    color: 'white',
    fontSize: 16,
  },
  participantsButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  participantsButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  participantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  kickButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
  },
  kickButtonText: {
    color: 'white',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default VideoCall;


