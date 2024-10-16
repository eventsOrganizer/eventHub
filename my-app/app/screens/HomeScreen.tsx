import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../services/supabaseClient';
import NavBar from '../components/NavBar';
import ServiceIcons from '../components/ServiceIcons';
import EventSection from '../components/event/EventSection';
import SectionComponent from '../components/SectionComponent';
import CustomButton from '../components/PersonalServiceComponents/customButton';
import EventMarquee from '../screens/EventMarquee';
import VIPServicesContainer from '../components/VIPServicesContainer';
import EventSectionContainer from '../components/event/EventSectionContainer';
import BeautifulSectionHeader from '../components/event/BeautifulSectionHeader';

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

const RedStripe = () => (
  <View style={styles.redStripe} />
);

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [staffServices, setStaffServices] = useState<any[]>([]);
  const [localServices, setLocalServices] = useState<any[]>([]);
  const [materialsAndFoodServices, setMaterialsAndFoodServices] = useState<any[]>([]);
  const [locals, setLocals] = useState<any[]>([]);
  const [displayMode, setDisplayMode] = useState<'all' | 'events' | 'services'>('all');

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('event')
      .select(`
        *,
        subcategory (
          id,
          name,
          category (
            id,
            name
          )
        ),
        location (id, longitude, latitude),
        availability (id, start, end, daysofweek, date),
        media (url)
      `);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  const fetchLocals = async () => {
    const { data, error } = await supabase
      .from('local')
      .select(`
        *,
        subcategory (
          id,
          name,
          category (
            id,
            name
          )
        ),
        location (id, longitude, latitude),
        availability (id, start, end, daysofweek, date),
        media (url)
      `);
  
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  const fetchData = async () => {
    try {
      const eventsData = await fetchEvents();
      const localsData = await fetchLocals();
      setEvents(eventsData);
      setLocals(localsData);

      const { data: staffServicesData } = await supabase
        .from('personal')
        .select('*, subcategory (name), media (url)')
        .limit(5);

      const { data: materialsAndFoodServicesData } = await supabase.from('material').select('*');

      if (staffServicesData) setStaffServices(staffServicesData);
      if (materialsAndFoodServicesData) setMaterialsAndFoodServices(materialsAndFoodServicesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSeeAllEvents = () => {
    navigation.navigate('AllEvents');
  };

  const handleStaffServicePress = (item: any) => {
    navigation.navigate('PersonalDetail', { personalId: item.id });
  };

  const handleSeeAllStaffServices = () => {
    navigation.navigate('PersonalsScreen', { category: 'all' });
  };

  const handleSeeAllLocalServices = () => {
    navigation.navigate('LocalServiceScreen');
  };

  const handleLocalServicePress = (item: any) => {
    console.log('Navigating to LocalServiceDetails with id:', item.id);
    navigation.navigate('LocalServiceDetails', { localServiceId: item.id });
  };

  const handleSeeAllMaterialsAndFoodServices = () => {
    navigation.navigate('MaterialsAndFoodServicesScreen');
  };

  const handleMaterialsAndFoodServicePress = (item: any) => {
    navigation.navigate('MaterialServiceDetail', { materialId: item.id });
  };

  const togglemode = () => {
    setDisplayMode((prevMode) => {
      switch (prevMode) {
        case 'all':
          return 'events';
        case 'events':
          return 'services';
        case 'services':
          return 'all';
        default:
          return 'all';
      }
    });
  };

  return (
    <LinearGradient
      colors={['#8B0000', '#4B0082']}
      style={styles.container}
    >
      <NavBar selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
      <RedStripe />
      <ScrollView style={styles.sections} contentContainerStyle={styles.scrollViewContent}>
        <EventMarquee events={events} />
        <ServiceIcons />
        <BeautifulSectionHeader title="EVENTS" onSeeAllPress={togglemode} />
        <EventSectionContainer>
          <EventSection 
            title="Your events" 
            events={events} 
            navigation={navigation}
            onSeeAll={handleSeeAllEvents}
            isTopEvents={false}
          />
          <EventSection 
            title="Top events" 
            events={events} 
            navigation={navigation}
            onSeeAll={handleSeeAllEvents}
            isTopEvents={true}
          />
        </EventSectionContainer>
        <BeautifulSectionHeader title="SERVICES" onSeeAllPress={togglemode} />
        <VIPServicesContainer>
          <SectionComponent 
            title="Top staff services"
            data={staffServices}
            onSeeAll={handleSeeAllStaffServices}
            onItemPress={handleStaffServicePress}
            type="staff"
          />
          <SectionComponent 
            title="Top locals services" 
            data={locals} 
            onSeeAll={handleSeeAllLocalServices} 
            onItemPress={handleLocalServicePress}
            type="local"
          />
          <SectionComponent 
            title="Top materials services" 
            data={materialsAndFoodServices} 
            onSeeAll={handleSeeAllMaterialsAndFoodServices} 
            onItemPress={handleMaterialsAndFoodServicePress}
            type="material"
          />
        </VIPServicesContainer>
        {/* <CustomButton
          title="Check Messages"
          onPress={() => navigation.navigate('ChatList')}
          style={styles.messageButton}
        /> */}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  redStripe: {
    height: 4,
    backgroundColor: 'white',
    width: '100%',
  },
  sections: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllButtonContainer: {
    width: 80,
  },
  seeAllButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  serviceCard: {
    width: 150,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
  },
  serviceImage: {
    width: 130,
    height: 100,
    borderRadius: 5,
    marginBottom: 5,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  servicePrice: {
    fontSize: 14,
    color: 'green',
  },
  messageButton: {
    marginTop: 10,
    marginHorizontal: 10,
  },
});

export default HomeScreen;