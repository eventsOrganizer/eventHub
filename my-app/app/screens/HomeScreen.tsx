import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, RefreshControl, SafeAreaView, Button, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';

// Components imports remain the same as original
import NavBar from '../components/NavBar';
import ServiceIcons from '../components/ServiceIcons';
import EventSection from '../components/event/EventSection';
import SectionComponent from '../components/SectionComponent';
import EventMarquee from './EventMarquee';
import FAB from '../components/FAB';
import Banner from '../components/event/Banner';
import { supabase } from '../services/supabaseClient';
import { RootStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState({
    events: [],
    topEvents: [],
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
        supabase.from('event').select(`*, subcategory (id, name, category (id, name)), location (id, longitude, latitude), availability (id, start, end, daysofweek, date), media (url)`),
        supabase.from('event').select(`*, subcategory (id, name, category (id, name)), location (id, longitude, latitude), availability (id, start, end, daysofweek, date), media (url)`).limit(10),
        supabase.from('local').select(`*, subcategory (id, name, category (id, name)), location (id, longitude, latitude), availability (id, start, end, daysofweek, date), media (url)`),
        supabase.from('personal').select('*, subcategory (id,name,category(id,name)), media (url)').limit(5),
        supabase.from('material').select('*, subcategory (id, name, category (id, name)), media (url)').limit(5)
      ]);

      setData({
        events: events.data || [],
        topEvents: topEvents.data || [],
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
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
      return () => {
        // Cleanup if needed
      };
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
      <SafeAreaView style={tw`flex-1 justify-center items-center bg-[#001F3F]`}>
        <ActivityIndicator size="large" color="#4B0082" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-[#001F3F]`}>
      <LinearGradient colors={['#4B0082', '#0066CC', '#00BFFF', 'white']} style={tw`flex-1`}>
        <BlurView intensity={100} tint="dark" style={tw`py-4`}>
          <NavBar selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} onSearch={handleSearch} />
        </BlurView>
        
        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={tw`pb-40`}
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={loadData} 
              colors={['#4B0082']} 
            />
          }
          nestedScrollEnabled={true}
        >
          <EventMarquee events={data.events.slice(0, 10)} />
          <ServiceIcons />
          <View style={tw`mt-6`}>
            <Banner title="Events" />
            <EventSection 
              title="YOUR EVENTS" 
              events={data.filteredEvents} 
              navigation={navigation} 
              onSeeAll={() => navigation.navigate('AllEvents')} 
              isTopEvents={false} 
            />
            <EventSection 
              title="HOT EVENTS" 
              events={data.topEvents} 
              navigation={navigation} 
              onSeeAll={() => navigation.navigate('AllEvents')} 
              isTopEvents={true} 
            />
          </View>
          <View style={tw`mt-6`}>
            <Banner title="Services" />
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
          <Button 
            title="Go to Video Rooms" 
            onPress={() => navigation.navigate('VideoRooms')} 
          />
        </ScrollView>
        <FAB 
          isFabOpen={isFabOpen} 
          toggleFab={() => setIsFabOpen(!isFabOpen)} 
          onCreateService={() => navigation.navigate('ServiceSelection')} 
          onCreateEvent={() => navigation.navigate('EventCreation')} 
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

export default HomeScreen;