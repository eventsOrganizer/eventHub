import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
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
  const [staffServices, setStaffServices] = useState<any[]>([]);
  const [locals, setLocals] = useState<any[]>([]);
  const [materialsAndFoodServices, setMaterialsAndFoodServices] = useState<any[]>([]);
  const [displayMode, setDisplayMode] = useState<'all' | 'events' | 'services'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsData, localsData, staffServicesData, materialsAndFoodServicesData] = await Promise.all([
        fetchEvents(),
        fetchLocals(),
        fetchStaffServices(),
        fetchMaterialsAndFoodServices()
      ]);

      setEvents(eventsData);
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
      .limit(10);
    if (error) throw new Error(error.message);
    return data;
  };

  const fetchLocals = async () => {
    const { data, error } = await supabase
      .from('local')
      .select(`*, subcategory (id, name, category (id, name)), location (id, longitude, latitude), availability (id, start, end, daysofweek, date), media (url)`)
      .limit(5);
    if (error) throw new Error(error.message);
    return data;
  };

  const fetchStaffServices = async () => {
    const { data, error } = await supabase
      .from('personal')
      .select('*, subcategory (name), media (url)')
      .limit(5);
    if (error) throw new Error(error.message);
    return data;
  };

  const fetchMaterialsAndFoodServices = async () => {
    const { data, error } = await supabase.from('material').select('*').limit(5);
    if (error) throw new Error(error.message);
    return data;
  };

  const handleSeeAllEvents = () => navigation.navigate('AllEvents');
  const handleStaffServicePress = (item: any) => navigation.navigate('PersonalDetail', { personalId: item.id });
  const handleSeeAllStaffServices = () => navigation.navigate('PersonalsScreen', { category: 'all' });
  const handleSeeAllLocalServices = () => navigation.navigate('LocalServiceScreen');
  const handleLocalServicePress = (item: any) => navigation.navigate('LocalServiceDetails', { localServiceId: item.id });
  const handleSeeAllMaterialsAndFoodServices = () => navigation.navigate('MaterialsAndFoodServicesScreen');
  const handleMaterialsAndFoodServicePress = (item: any) => navigation.navigate('MaterialServiceDetail', { materialId: item.id });

  const toggleMode = () => {
    setDisplayMode((prevMode) => {
      switch (prevMode) {
        case 'all': return 'events';
        case 'events': return 'services';
        case 'services': return 'all';
        default: return 'all';
      }
    });
  };

  const renderSectionHeader = (title: string, onPress: () => void) => (
    <LinearGradient
      colors={['#FF6B6B', '#FF8E53', '#FFA726']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.sectionHeader}
    >
      <Text style={styles.sectionHeaderTitle}>{title}</Text>
      <TouchableOpacity onPress={onPress} style={styles.seeAllButton}>
        <Text style={styles.seeAllButtonText}>See All</Text>
        <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </LinearGradient>
  );

  return (
    <LinearGradient
      colors={['#FFFFFF', '#FFF5E6', '#FFE0B2', '#FFCC80', '#FFB74D', '#FFA726', '#FF9800', '#FB8C00', '#F57C00', '#EF6C00', '#E65100']}
      locations={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
      style={styles.container}
    >
      <NavBar selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <EventMarquee events={events} />
        <ServiceIcons />
        
        {renderSectionHeader("EVENTS", toggleMode)}
        <View style={styles.sectionContainer}>
          <EventSection 
            title="Your events" 
            events={events.slice(0, 3)} 
            navigation={navigation}
            onSeeAll={handleSeeAllEvents}
            isTopEvents={false}
          />
          <EventSection 
            title="Top events" 
            events={events.slice(3, 6)} 
            navigation={navigation}
            onSeeAll={handleSeeAllEvents}
            isTopEvents={true}
          />
        </View>

        {renderSectionHeader("SERVICES", toggleMode)}
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
  );
};

const styles = StyleSheet.create({
  container: {
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
    marginHorizontal: 10,
    borderRadius: 10,
  },
  sectionHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllButtonText: {
    color: '#FF8C00',
    fontSize: 16,
    marginRight: 5,
  },
  sectionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    marginHorizontal: 10,
    marginTop: 10,
    padding: 10,
  },
});

export default HomeScreen;