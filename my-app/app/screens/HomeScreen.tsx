import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, RefreshControl, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabaseClient';
import NavBar from '../components/NavBar';
import ServiceIcons from '../components/ServiceIcons';
import EventSection from '../components/event/EventSection';
import SectionComponent from '../components/SectionComponent';
import EventMarquee from '../screens/EventMarquee';

type RootStackParamList = {
  Home: undefined;
  PersonalsScreen: { category: string };
  ChatList: undefined;
  PersonalDetail: { personalId: number };
  EventDetails: { eventId: number };
  AllEvents: undefined;
  LocalServicesScreen: undefined;
  MaterialsAndFoodServicesScreen: undefined;
  LocalServiceScreen: undefined;
  MaterialServiceDetail: { materialId: number };
  LocalServiceDetails: { localServiceId: number };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [topEvents, setTopEvents] = useState<any[]>([]);
  const [staffServices, setStaffServices] = useState<any[]>([]);
  const [locals, setLocals] = useState<any[]>([]);
  const [materialsAndFoodServices, setMaterialsAndFoodServices] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsData, topEventsData, localsData, staffServicesData, materialsAndFoodServicesData] = await Promise.all([
        fetchEvents(),
        fetchTopEvents(),
        fetchLocals(),
        fetchStaffServices(),
        fetchMaterialsAndFoodServices()
      ]);

      setEvents(eventsData);
      setTopEvents(topEventsData);
      setLocals(localsData);
      setStaffServices(staffServicesData);
      setMaterialsAndFoodServices(materialsAndFoodServicesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('event')
      .select(`*, subcategory (id, name, category (id, name)), location (id, longitude, latitude), availability (id, start, end, daysofweek, date), media (url)`)
 
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
    return data || [];
  };

  const fetchStaffServices = async () => {
    const { data, error } = await supabase
      .from('personal')
      .select('*, subcategory (name), media (url)')
      .limit(5);
    if (error) throw new Error(error.message);
    return data || [];
  };

  const fetchMaterialsAndFoodServices = async () => {
    const { data, error } = await supabase.from('material').select('*').limit(5);
    if (error) throw new Error(error.message);
    return data || [];
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

  const handleSeeAllEvents = () => navigation.navigate('AllEvents');
  const handleStaffServicePress = (item: any) => navigation.navigate('PersonalDetail', { personalId: item.id });
  const handleSeeAllStaffServices = () => navigation.navigate('PersonalsScreen', { category: 'all' });
  const handleSeeAllLocalServices = () => navigation.navigate('LocalServiceScreen');
  const handleLocalServicePress = (item: any) => navigation.navigate('LocalServiceDetails', { localServiceId: item.id });
  const handleSeeAllMaterialsAndFoodServices = () => navigation.navigate('MaterialsAndFoodServicesScreen');
  const handleMaterialsAndFoodServicePress = (item: any) => navigation.navigate('MaterialServiceDetail', { materialId: item.id });

  const renderSectionHeader = (title: string, onPress: () => void) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderTitle}>{title}</Text>
      <TouchableOpacity onPress={onPress} style={styles.seeAllButton}>
        <Text style={styles.seeAllButtonText}>See All</Text>
        <Ionicons name="chevron-forward" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#E6F3FF', '#CCE7FF']}
        style={styles.gradient}
      >
        <NavBar selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <EventMarquee events={events.slice(0, 10)} />
          <ServiceIcons />
          
          {renderSectionHeader("EVENTS", handleSeeAllEvents)}
          <View style={styles.sectionContainer}>
            <EventSection 
              title="Your events" 
              events={events} 
              navigation={navigation}
              onSeeAll={handleSeeAllEvents}
              isTopEvents={false}
            />
            <EventSection 
              title="Top events" 
              events={topEvents} 
              navigation={navigation}
              onSeeAll={handleSeeAllEvents}
              isTopEvents={true}
            />
          </View>

          {renderSectionHeader("SERVICES", handleSeeAllStaffServices)}
          <View style={styles.sectionContainer}>
            <SectionComponent 
              title="Top staff services"
              data={staffServices}
              onSeeAll={handleSeeAllStaffServices}
              onItemPress={handleStaffServicePress}
              type="staff"
            />
            <SectionComponent 
              title="Top local services" 
              data={locals} 
              onSeeAll={handleSeeAllLocalServices} 
              onItemPress={handleLocalServicePress}
              type="local"
            />
            <SectionComponent 
              title="Top material services" 
              data={materialsAndFoodServices} 
              onSeeAll={handleSeeAllMaterialsAndFoodServices} 
              onItemPress={handleMaterialsAndFoodServicePress}
              type="material"
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  seeAllButtonText: {
    color: '#007AFF',
    fontSize: 16,
    marginRight: 5,
    fontWeight: '600',
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginHorizontal: 10,
    marginTop: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default HomeScreen;