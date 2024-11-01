import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import tw from 'twrnc';
import HomeHeader from '../components/home/HomeHeader';
import ServiceIcons from '../components/ServiceIcons';
import EventSection from '../components/event/EventSection';
import  ServicesSection  from '../components/home/ServicesSection';
import EventMarquee from './EventMarquee';
import FAB from '../components/FAB';
import { supabase } from '../services/supabaseClient';
import { HomeScreenProps, HomeScreenSection } from '../navigation/types';
import { theme } from '../../lib/theme';

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [topEvents, setTopEvents] = useState<any[]>([]);
  const [staffServices, setStaffServices] = useState<any[]>([]);
  const [locals, setLocals] = useState<any[]>([]);
  const [materialsAndFoodServices, setMaterialsAndFoodServices] = useState<any[]>([]);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState<any[]>(events);
  const [filteredServices, setFilteredServices] = useState<any[]>(staffServices);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const serviceSections: HomeScreenSection[] = React.useMemo(() => {
    if (!staffServices || !locals || !materialsAndFoodServices) {
      return [];
    }

    return [
      {
        title: "TOP CREW SERVICES",
        data: staffServices || [],
        type: "staff",
        onSeeAll: () => navigation.navigate('PersonalsScreen', { category: 'all' }),
        onItemPress: (item) => navigation.navigate('PersonalDetail', { personalId: item.id })
      },
      {
        title: "VENUE SERVICES",
        data: locals || [],
        type: "local",
        onSeeAll: () => navigation.navigate('LocalsScreen' as never),
        onItemPress: (item) => navigation.navigate('LocalServiceDetails', { localId: item.id })
      },
      {
        title: "TOP EQUIPMENTS",
        data: materialsAndFoodServices || [],
        type: "material",
        onSeeAll: () => navigation.navigate('MaterialScreen' as never),
        onItemPress: (item) => navigation.navigate('MaterialDetail', { material: item })
      }
    ];
  }, [staffServices, locals, materialsAndFoodServices, navigation])

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
  const fetchMaterials = async () => {
    const { data, error } = await supabase
      .from('material')
      .select('*, subcategory (id, name, category (id, name)), media (url)')
      .limit(5);

    if (error) throw new Error(error.message);
    return data || [];

 
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadData().then(() => setRefreshing(false));
  }, []);

  const toggleFab = () => setIsFabOpen(!isFabOpen);


  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setFilteredEvents(events);
      setFilteredServices(staffServices);
      return;
    }
  
    const normalizedSearchTerm = searchTerm.toLowerCase();
  
    // Filter events
    const newFilteredEvents = events.filter(event => {
      const title = event.title?.toLowerCase() || '';
      const description = event.description?.toLowerCase() || '';
      return title.includes(normalizedSearchTerm) || description.includes(normalizedSearchTerm);
    });
  
    // Filter services
    const newFilteredServices = staffServices.filter(service => {
      const name = service.name?.toLowerCase() || '';
      const details = service.details?.toLowerCase() || '';
      return name.includes(normalizedSearchTerm) || details.includes(normalizedSearchTerm);
    });
  
    // Additional filtering based on selected filter
    if (selectedFilter === 'this_week') {
      // Implement your logic to filter for this week
    } else if (selectedFilter === 'this_month') {
      // Implement your logic to filter for this month
    }
  
    setFilteredEvents(newFilteredEvents);
    setFilteredServices(newFilteredServices);
  };
  



  
 
  return (
    <SafeAreaView style={tw`flex-1 bg-[${theme.colors.primary}]`}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientMiddle, theme.colors.gradientEnd]}
        style={tw`flex-1`}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={tw`flex-1`}>
          {/* Fixed Header */}
          <View style={tw`absolute top-0 left-0 right-0 z-50`}>
            <HomeHeader
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              onSearch={handleSearch}
            />
          </View>

          {/* Event Marquee and Service Icons Container - Fixed */}
          <View style={tw`absolute top-48 left-0 right-0 z-40 bg-transparent`}>
            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', duration: 1000 }}
              style={tw`shadow-lg rounded-${theme.borderRadius.lg} overflow-hidden mb-${theme.spacing.md} mx-4`}
            >
              <EventMarquee events={events?.slice(0, 10) || []} />
            </MotiView>

            <View style={tw`bg-[${theme.colors.gradientStart}]`}>
              <ServiceIcons navigation={navigation} />
            </View>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={tw`flex-1 mt-[360px]`} // Adjusted margin to account for fixed elements
            contentContainerStyle={tw`pb-32`}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                tintColor={theme.colors.secondary}
                colors={[theme.colors.secondary, theme.colors.accent]}
              />
            }
            showsVerticalScrollIndicator={false}
          >
            {/* Event Sections */}
            <View style={tw`space-y-${theme.spacing.lg} px-4`}>
              <EventSection 
                title="YOUR EVENTS" 
                events={events || []} 
                navigation={navigation}
                onSeeAll={() => navigation.navigate('AllEvents')}
                isTopEvents={false}
              />

              <EventSection 
                title="HOT EVENTS" 
                events={topEvents || []} 
                navigation={navigation}
                onSeeAll={() => navigation.navigate('AllEvents')}
                isTopEvents={true}
              />

              <ServicesSection sections={serviceSections} />
            </View>
          </ScrollView>

          {/* FAB */}
          <View style={tw`absolute bottom-0 right-0 z-50`}>
            <FAB 
              isFabOpen={isFabOpen}
              toggleFab={toggleFab}
              onCreateService={() => navigation.navigate('ServiceSelection')}
              onCreateEvent={() => navigation.navigate('EventCreation')}
            />
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default HomeScreen;