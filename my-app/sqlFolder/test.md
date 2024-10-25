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


