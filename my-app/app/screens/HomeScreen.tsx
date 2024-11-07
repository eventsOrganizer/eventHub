import React, { useState, useCallback } from 'react';
import { View, Text, RefreshControl, SafeAreaView, Button, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { fetchEventsByUserInterests } from '../api/event/interestEventService';
import NavBar from '../components/NavBar';
import ServiceIcons from '../components/ServiceIcons';
import EventSection from '../components/event/EventSection';
import SectionComponent from '../components/SectionComponent';
import EventMarquee from './EventMarquee';
import FAB from '../components/FAB';
import Banner from '../components/event/Banner';
import { supabase } from '../services/supabaseClient';
import { RootStackParamList } from '../navigation/types';
import { useUser } from '../UserContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import LoadingScreen from '../components/LoadingScreen';
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
    
const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { userId, selectedInterests } = useUser();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState({
    events: [],
    topEvents: [],
    interestEvents: [],
    staffServices: [],
    locals: [],
    materials: [],
    filteredEvents: [],
    filteredServices: []
  });

  const [isFabOpen, setIsFabOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [events, topEvents, locals, staff, materials] = await Promise.all([
        supabase.from('event').select(`*, subcategory (id, name, category (id, name)), location (id, longitude, latitude), availability (id, start, end, daysofweek, date), media (url)`).limit(5),
        supabase.from('event').select(`*, subcategory (id, name, category (id, name)), location (id, longitude, latitude), availability (id, start, end, daysofweek, date), media (url)`).limit(5),
        supabase.from('local').select(`*, subcategory (id, name, category (id, name)), location (id, longitude, latitude), availability (id, start, end, daysofweek, date), media (url)`).limit(5),
        supabase.from('personal').select('*, subcategory (id,name,category(id,name)), media (url)').limit(5),
        supabase.from('material').select('*, subcategory (id, name, category (id, name)), media (url)').limit(5)
      ]);

      console.log('Fetching interest events for userId:', userId);
      const interestEvents = await fetchEventsByUserInterests(userId, selectedInterests);
      console.log('Interest Events Length:', interestEvents?.length || 0);

      setData({
        events: events.data || [],
        topEvents: topEvents.data || [],
        interestEvents: interestEvents || [],
        staffServices: staff.data || [],
        locals: locals.data?.filter(item => item.subcategory !== null) || [],
        materials: materials.data || [],
        filteredEvents: events.data || [],
        filteredServices: staff.data || []
      });

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId, selectedInterests]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleSearch = useCallback((searchTerm: string) => {
    if (!searchTerm) {
      setData(prev => ({
        ...prev,
        filteredEvents: prev.events,
        filteredServices: prev.staffServices
      }));
      return;
    }

    const term = searchTerm.toLowerCase();
    setData(prev => ({
      ...prev,
      filteredEvents: prev.events.filter(event => 
        (event.name?.toLowerCase() || '').includes(term) || 
        (event.description?.toLowerCase() || '').includes(term)
      ),
      filteredServices: prev.staffServices.filter(service =>
        (service.name?.toLowerCase() || '').includes(term) ||
        (service.details?.toLowerCase() || '').includes(term)
      )
    }));
  }, []);

  if (loading) {
    return (
      <LoadingScreen />
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9', '#E2E8F0', '#CBD5E1']}
        style={tw`flex-1`}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <BlurView intensity={85} tint="light" style={tw`py-4 mt-2`}>
       
          <NavBar 
            selectedFilter={selectedFilter} 
            setSelectedFilter={setSelectedFilter} 
            onSearch={handleSearch}
          />
        </BlurView>
        
        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={tw`pb-40`}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={loadData} 
              colors={['#64748B']} 
              tintColor="#64748B"
            />
          }
          nestedScrollEnabled={true}
        >
          <BlurView intensity={85} tint="light" style={tw`mb-1`}>
            <EventMarquee events={data.events.slice(0, 10)} />
          </BlurView>
  
          <BlurView intensity={85} tint="light" style={tw`mx-3 rounded-3xl overflow-hidden p-2 mb-1`}>
            <ServiceIcons />
          </BlurView>
<View style={tw`h-2 bg-[#3B82F6] mb-2`} />
          
          <View style={tw`mb-2`}>
            <Banner title="Events" />
            <View style={tw`px-3`}>
              {data.interestEvents.length > 0 && (
                <EventSection 
                  title="EVENTS FOR YOU" 
                  events={data.interestEvents} 
                  navigation={navigation} 
                  onSeeAll={() => navigation.navigate('AllEvents', { section: 'EVENTS_FOR_YOU' })}  
                  isTopEvents={true} 
                />
              )}
              <EventSection 
                title="YOUR EVENTS" 
                events={data.filteredEvents} 
                navigation={navigation} 
                onSeeAll={() => navigation.navigate('AllEvents', { section: 'YOUR_EVENTS' })} 
                isTopEvents={false} 
              />
              <EventSection 
                title="HOT EVENTS" 
                events={data.topEvents} 
                navigation={navigation} 
                onSeeAll={() => navigation.navigate('AllEvents', { section: 'HOT_EVENTS' })} 
                isTopEvents={true} 
              />
            </View>
          </View>
  
          <View style={tw`mb-4`}>
            <Banner title="Services" />
            <View style={tw`px-3`}>
              <SectionComponent 
                title="TOP CREW SERVICES" 
                data={data.staffServices} 
                onSeeAll={() => navigation.navigate('PersonalsScreen', { category: 'all' })} 
                onItemPress={(item) => navigation.navigate('PersonalDetail', { personalId: item.id })} 
                type="staff" 
              />
              <SectionComponent 
                title="VENUE SERVICES" 
                data={data.locals} 
                onSeeAll={() => navigation.navigate('LocalsScreen')} 
                onItemPress={(item) => navigation.navigate('LocalServiceDetails', { localServiceId: item.id })} 
                type="local" 
              />
              <SectionComponent 
                title="TOP EQUIPMENTS" 
                data={data.materials} 
                onSeeAll={() => navigation.navigate('MaterialScreen')} 
                onItemPress={(item) => navigation.navigate('MaterialDetail', { material: item })} 
                type="material" 
              />
            </View>
          </View>
          
          {/* <BlurView intensity={85} tint="light" style={tw`mx-3 rounded-3xl overflow-hidden p-4 mb-4`}>
            <TouchableOpacity
              style={tw`bg-gray-800 p-4 rounded-xl flex-row items-center justify-center`}
              onPress={() => navigation.navigate('VideoRooms')}
            >
              <Ionicons name="videocam" size={24} color="white" style={tw`mr-2`} />
              <Text style={tw`text-white font-semibold text-lg`}>Video Rooms</Text>
            </TouchableOpacity>
          </BlurView> */}
        </ScrollView>
        
        {/* <FAB 
          isFabOpen={isFabOpen} 
          toggleFab={() => setIsFabOpen(!isFabOpen)} 
          onCreateService={() => navigation.navigate('ServiceSelection')} 
          onCreateEvent={() => navigation.navigate('EventCreation')} 
        /> */}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default HomeScreen;