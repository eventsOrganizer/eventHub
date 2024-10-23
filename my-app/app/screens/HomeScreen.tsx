import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, SafeAreaView, ImageBackground, Animated, Button } from 'react-native'; // Import Button
import { useNavigation } from '@react-navigation/native';
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
  const scrollY = new Animated.Value(0);

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

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-900`}>
      <ImageBackground
        source={{ uri: 'https://thumbs.dreamstime.com/b/disco-club-colored-lighting-abstract-scene-night-bright-rays-light-smoke-296592406.jpg' }}
        style={tw`flex-1 w-full h-full`}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.3)']}
          style={tw`absolute inset-0`}
        />
        <BlurView intensity={80} tint="dark" style={tw`flex-1`}>
          <Animated.View style={[tw`absolute top-0 left-0 right-0 z-10`, { opacity: headerOpacity }]}>
            <BlurView intensity={100} tint="dark" style={tw`py-4`}>
              <NavBar selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} onSearch={() => {}} />
            </BlurView>
          </Animated.View>
          
          <Animated.ScrollView
            style={tw`flex-1`}
            contentContainerStyle={tw`pb-20 pt-4`}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          >
            <EventMarquee events={events.slice(0, 10)} />
            <View style={tw`px-4 py-6`}>
              <ServiceIcons />
            </View>

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

            <Banner title="Services" />
            <SectionComponent 
              title="TOP CREW SERVICES"
              data={staffServices}
              onSeeAll={() => navigation.navigate('PersonalsScreen', { category: 'all' })}
              onItemPress={(item) => navigation.navigate('PersonalDetail', { personalId: item.id })}
              type="staff"
            />

            <SectionComponent 
              title="VENUE SERVICES" 
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

            <Button
              title="Go to Video Rooms"
              onPress={() => navigation.navigate('VideoRooms')}
            />
          </Animated.ScrollView>
          <FAB 
            isFabOpen={isFabOpen}
            toggleFab={toggleFab}
            onCreateService={() => navigation.navigate('ServiceSelection')}
            onCreateEvent={() => navigation.navigate('EventCreation')}
          />
        </BlurView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default HomeScreen;
