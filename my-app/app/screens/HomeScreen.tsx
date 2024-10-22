import React, { useState } from 'react';
import { View, ScrollView, RefreshControl, SafeAreaView, Button } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import NavBar from '../components/NavBar';
import ServiceIcons from '../components/ServiceIcons';
import EventSection from '../components/event/EventSection';
import SectionComponent from '../components/SectionComponent';
import EventMarquee from './EventMarquee';
import FAB from '../components/FAB';
import tw from 'twrnc';
import { supabase } from '../services/supabaseClient';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../navigation/types';
import Banner from '../components/event/Banner';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [topEvents, setTopEvents] = useState<any[]>([]);
  const [staffServices, setStaffServices] = useState<any[]>([]);
  const [locals, setLocals] = useState<any[]>([]);
  const [materialsAndFoodServices, setMaterialsAndFoodServices] = useState<any[]>([]);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const fetchMaterials = async () => {
    console.log('Fetching materials...'); 
    const { data, error } = await supabase
      .from('material')
      .select('id, name, price, price_per_hour, sell_or_rent, subcategory_id, media (url), details');
  
    if (error) {
      console.error('Error fetching materials:', error); 
      return [];
    } else {
      console.log('Materials fetched:', data); 
      return data?.map((item: Material) => ({
        ...item,
        subcategory: item.subcategory_id // Ensure correct mapping
      })) || [];
    }
  };

  const loadData = async () => {
    try {
      console.log('Loading data...'); // Log when loading starts
      const [
        eventsData,
        topEventsData,
        localsData,
        staffServicesData,
        materialsData // Add materialsData here
      ] = await Promise.all([
        fetchEvents(),
        fetchTopEvents(),
        fetchLocals(),
        fetchStaffServices(),
        fetchMaterials() // Call fetchMaterials here
      ]);

      console.log('Data loaded:', {
        eventsData,
        topEventsData,
        localsData,
        staffServicesData,
        materialsData
      }); // Log all loaded data

      setEvents(eventsData);
      setTopEvents(topEventsData);
      setLocals(localsData);
      setStaffServices(staffServicesData);
      setMaterialsAndFoodServices(materialsData); // Set materials data

      console.log('Materials and Food Services:', materialsData); // Log materials data
    } catch (error) {
      console.error('Error fetching data:', error); // Log any errors during loading
    }
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('event')
      .select(`*, subcategory (id, name, category (id, name)), location (id, longitude, latitude), availability (id, start, end, daysofweek, date), media (url)`);
    if (error) throw new Error(error.message);
    return data || [];
  };

  const fetchTopEvents = async () => {
    const { data, error } = await supabase
      .from('event')
      .select(`*, subcategory (id, name, category (id, name)), location (id, longitude, latitude), availability (id, start, end, daysofweek, date), media (url)`)
      .limit(10);
    if (error) throw new Error(error.message);
    return data || [];
  };

  const fetchLocals = async () => {
    const { data, error } = await supabase
      .from('local')
      .select(`*, subcategory (id, name, category (id, name)), location (id, longitude, latitude), availability (id, start, end, daysofweek, date), media (url)`)
    if (error) throw new Error(error.message);
    return (data || []).filter(item => item.subcategory !== null);
  };

  const fetchStaffServices = async () => {
    const { data, error } = await supabase
      .from('personal')
      .select('*, subcategory (id,name,category(id,name)), media (url) ')
      .limit(5);
    if (error) throw new Error(error.message);
    return data || [];
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadData().then(() => setRefreshing(false));
  }, []);

  const toggleFab = () => setIsFabOpen(!isFabOpen);

  return (
    <SafeAreaView style={tw`flex-1 bg-[#001F3F]`}>
      <LinearGradient
        colors={['#4B0082', '#0066CC', '#00BFFF', 'white']}
        style={tw`flex-1`}
      >
        <BlurView intensity={100} tint="dark" style={tw`py-4`}>
          <NavBar selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} onSearch={() => {}} />
        </BlurView>
        
        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={tw`pb-20 pt-4`}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <EventMarquee events={events.slice(0, 10)} />

          <View style={tw`mt-6`}>
            <ServiceIcons />
          </View>

          <View style={tw`mt-6`}>
            <Banner title="Events" />
            <EventSection 
              title="YOUR EVENTS" 
              events={events} 
              navigation={navigation}
              onSeeAll={() => navigation.navigate('AllEvents')}
              isTopEvents={false}
            />

            <EventSection 
              title="HOT EVENTS" 
              events={topEvents} 
              navigation={navigation}
              onSeeAll={() => navigation.navigate('AllEvents')}
              isTopEvents={true}
            />
          </View>

          <View style={tw`mt-6`}>
            <Banner title="Services" />
            <SectionComponent 
              title="TOP STAFF SERVICES"
              data={staffServices}
              onSeeAll={() => navigation.navigate('PersonalsScreen', { category: 'all' })}
              onItemPress={(item) => navigation.navigate('PersonalDetail', { personalId: item.id })}
              type="staff"
            />

            <SectionComponent 
              title="LOCAL SERVICES" 
              data={locals} 
              onSeeAll={() => navigation.navigate('LocalServiceScreen')}
              onItemPress={(item) => {
                console.log('Local service item:', item);
                navigation.navigate('LocalServiceDetails', { localServiceId: item.id });
              }}
              type="local"
            />
            
            <SectionComponent 
              title="MATERIALS & FOOD" 
              data={materialsAndFoodServices} 
              onSeeAll={() => navigation.navigate('MaterialScreen')}
              onItemPress={(item) => navigation.navigate('MaterialDetailScreen', { materialId: item.id })}
              type="material"
            />
          </View>

          <View style={tw`mt-6 mb-4`}>
            <Button
              title="Go to Video Rooms"
              onPress={() => navigation.navigate('VideoRooms')}
            />
          </View>
        </ScrollView>
        <FAB 
          isFabOpen={isFabOpen}
          toggleFab={toggleFab}
          onCreateService={() => navigation.navigate('ServiceSelection')}
          onCreateEvent={() => navigation.navigate('EventCreation')}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default HomeScreen;
